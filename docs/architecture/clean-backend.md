📘 Guia de Refatoração e Padronização: Vertical Slices no FastAPI
Este guia estabelece os padrões arquiteturais para manter os roteadores limpos, isolar metadados HTTP de documentação, padronizar a execução de lógica/queries e encapsular mapeamentos complexos de dados.

1. Documentação de Endpoints (EndpointsDocs)
Para evitar poluição visual nos decoradores do FastAPI, os metadados são isolados utilizando uma dataclass imutável em PascalCase.
A Base Compartilhada (app/shared/docs.py)

```python
from dataclasses import dataclass, field
from typing import Any

@dataclass(frozen=True)
class EndpointDoc:
    response_model: Any
    summary: str
    description: str | None = None
    extra_options: dict[str, Any] = field(default_factory=dict)

    @property
    def to_dict(self) -> dict[str, Any]:
        """Gera o dicionário de argumentos para o decorador do FastAPI."""
        base = {
            "response_model": self.response_model,
            "summary": self.summary,
        }
        if self.description:
            base["description"] = self.description
        return {**base, **self.extra_options}
```

O Uso no Slice (app/features/movies/router_metadata.py)

```python
from app.shared.docs import EndpointDoc
from app.features.movies.schemas import MovieListItemDTO
from app.shared.pagination import PaginatedResponse

ListMoviesDoc = EndpointDoc(
    response_model=PaginatedResponse[MovieListItemDTO],
    summary="Listagem paginada e filtrada de filmes para o catálogo",
    description="Retorna uma lista paginada aplicando filtros de busca textual e gênero."
)
```

2. Divisão de Camadas: Quem Conhece o FastAPI?
Para manter os Slices previsíveis, dividimos o código estritamente pelo seu acoplamento com o protocolo HTTP:
[ Requisição HTTP ] ──► [ Router / Dependencies ] ──► [ Queries / Handlers / Services ]
                           (Conhece o FastAPI)              (Código Python Puro)
Camada HTTP (Routers e Dependências)
• Onde vivem: auth_router.py, movies_router.py, dependencies.py.
• Regra: Podem importar fastapi, ler headers, injetar tokens e lançar HTTPException.
• Como simplificar injeções repetitivas (como Repositórios): Use inline lambda type-aliases para limpar a assinatura das rotas:python

```python
MoviesRepo = Annotated[MoviesRepository, Depends(lambda s=Depends(get_db): MoviesRepository(s))]
```

Camada de Dados e Negócio (Queries, Handlers e Services)
• Onde vivem: queries.py, handlers.py, service.py, repository.py.
• Regra: Proibido importar o FastAPI ou lançar HTTPException. Se um filme não for encontrado no repositório, ele retorna None ou lança uma exceção nativa do Python (ex: MovieNotFoundError). O Router captura isso e decide o status code HTTP (ex: 404 Not Found).

Quando usar cada um?
1. Queries (queries.py): Funções simples de leitura em banco de dados (SELECT) que apenas extraem dados brutos/modelos utilizando SQLAlchemy (onde o .scalars().all() deve morar).
2. Handlers (handlers.py): Funções simples de escrita ou comandos de passo único (ex: save_log).
3. Services (service.py): Classes ou módulos para regras de negócio complexas que possuem múltiplos passos (ex: criptografia, assinatura de JWT, chamadas a APIs externas).
3. Objetos de Parâmetros de Requisição (Form/Query Objects)

Evite funções com mais de 3 parâmetros vindos de strings de URL (Query). Agrupe-os em classes Pydantic dentro de schemas.py utilizando Depends().

```python
# app/features/movies/schemas.py
from fastapi import Query
from pydantic import BaseModel
from typing import Annotated

class MovieFilterParams(BaseModel):
    page: Annotated[int, Query(ge=1)] = 1
    page_size: Annotated[int, Query(ge=1, le=100)] = 20
    q: Annotated[str | None, Query(default=None)] = None
    genre: Annotated[str | None, Query(default=None)] = None
Use code with caution.
No Router, o FastAPI faz o parse automático:
python
@movies_router.get("", **ListMoviesDoc.to_dict())
async def list_movies(
    filters: Annotated[MovieFilterParams, Depends()],
    repo: MoviesRepo,
):
    return await repo.list_movies(filters) # Passa o objeto completo para o repositório
```

4. Mappers de Modelos para DTOs (from_model)
Fazer mapeamentos manuais gigantescos e instanciações complexas poluidores dentro de repositórios ou roteadores quebra o princípio de responsabilidade única. Encapsule essa lógica no DTO através de um método de fábrica (classmethod).
Aplicando o Mapper no Schema (app/features/movies/schemas.py)

```python
from pydantic import BaseModel
from datetime import date
from typing import Any

class MovieDetailDTO(BaseModel):
    sk_movie_id: int
    id_filme: int
    titulo: str
    data_lancamento: str | None
    # ... outros campos ...
    generos: list[GenreDTO]
    produtoras: list[CompanyDTO]

    @classmethod
    def from_model(
        cls, 
        movie: Any, 
        diretores: list[Any], 
        roteiristas: list[Any], 
        atores: list[Any], 
        metrics_dto: Any, 
        user_rating_val: float | None,
        rev: Any
    ) -> "MovieDetailDTO":
        """Mapeia os modelos do banco de dados agregados para o DTO de resposta."""
        return cls(
            sk_movie_id=movie.sk_movie_id,
            id_filme=movie.id_filme,
            titulo=movie.titulo,
            data_lancamento=movie.data_lancamento.isoformat() if movie.data_lancamento else None,
            ano_lancamento=movie.ano_lancamento,
            duracao_minutos=movie.duracao_minutos,
            status_filme=movie.status_filme,
            sinopse=movie.sinopse,
            url_poster=movie.url_poster,
            url_backdrop=movie.url_backdrop,
            generos=[GenreDTO.from_model(g) for g in getattr(movie, "genres", [])],
            produtoras=[CompanyDTO.from_model(c) for c in getattr(movie, "companies", [])],
            diretores=diretores,
            roteiristas=roteiristas,
            atores=atores,
            metricas=metrics_dto,
            nota_media_usuarios=float(user_rating_val) if user_rating_val is not None else None,
            qtd_avaliacoes_usuarios=getattr(rev, "qtd_avaliacoes_usuarios", 0) or 0,
        )
```

Como o Repositório fica limpo após o Mapper:
```python
# app/features/movies/repository.py
async def get_movie_by_id(self, movie_id: str) -> MovieDetailDTO | None:
    # 1. Executa as buscas e agregações necessárias no banco...
    movie = await self.session.execute(...)
    
    if not movie:
        return None
        
    # 2. Apenas repassa os dados para o DTO se auto-construir
    return MovieDetailDTO.from_model(
        movie=movie,
        diretores=diretores,
        roteiristas=roteiristas,
        atores=atores,
        metrics_dto=metrics_dto,
        user_rating_val=user_rating_val,
        rev=rev
    )
```
Combinando todas as técnicas acordadas, suas rotas passam a ter este visual limpo e focado:

```python
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from app.db.session import get_db
from app.features.movies.repository import MoviesRepository
from app.features.movies.schemas import MovieFilterParams, MovieDetailDTO
from app.features.movies.router_metadata import ListMoviesDoc, GetMovieDetailDoc

movies_router = APIRouter()
MoviesRepo = Annotated[MoviesRepository, Depends(lambda s=Depends(get_db): MoviesRepository(s))]

@movies_router.get("", **ListMoviesDoc.to_dict())
async def list_movies(filters: Annotated[MovieFilterParams, Depends()], repo: MoviesRepo):
    return await repo.list_movies(filters)

@movies_router.get("/{movie_id}", **GetMovieDetailDoc.to_dict())
async def get_movie_detail(movie_id: str, repo: MoviesRepo) -> MovieDetailDTO:
    if not (movie := await repo.get_movie_by_id(movie_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com ID '{movie_id}' não foi encontrado.",
        )
    return movie
```

