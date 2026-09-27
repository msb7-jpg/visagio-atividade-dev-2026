#!/usr/bin/env python3
"""Script de ingestão de dados (Seed Database) a partir dos arquivos CSV da camada analítica.

Executa a importação em lotes atômicos com tratamento de nulos e parsing adequado.
"""

from __future__ import annotations

import csv
import sqlite3
import sys
import time
from pathlib import Path

# Raiz do projeto
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
DB_PATH = ROOT_DIR / "backend" / "rocketlab.db"

BATCH_SIZE = 5000


def clean_str(val: str | None) -> str | None:
    if val is None:
        return None
    val = val.strip()
    return val if val != "" else None


def clean_int(val: str | None) -> int | None:
    if val is None:
        return None
    val = val.strip()
    if not val:
        return None
    try:
        # Lidar com casos como "2017.0"
        return int(float(val))
    except (ValueError, TypeError):
        return None


def clean_float(val: str | None) -> float | None:
    if val is None:
        return None
    val = val.strip()
    if not val:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def clean_date(val: str | None) -> str | None:
    # Retorna YYYY-MM-DD
    val = clean_str(val)
    if not val:
        return None
    # Validação simples
    parts = val.split("-")
    if len(parts) == 3:
        return val
    return None


def seed_table(
    cursor: sqlite3.Cursor,
    csv_file: Path,
    table_name: str,
    columns: list[str],
    transform_fn,
) -> int:
    print(f"-> Ingerindo {table_name} a partir de {csv_file.name}...")
    start_time = time.time()
    total_rows = 0

    placeholders = ", ".join(["?"] * len(columns))
    cols_str = ", ".join(columns)
    sql = f"INSERT OR IGNORE INTO {table_name} ({cols_str}) VALUES ({placeholders})"

    with open(csv_file, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        batch = []
        for row in reader:
            record = transform_fn(row)
            if record is not None:
                batch.append(record)
                total_rows += 1

            if len(batch) >= BATCH_SIZE:
                cursor.executemany(sql, batch)
                batch.clear()

        if batch:
            cursor.executemany(sql, batch)
            batch.clear()

    elapsed = time.time() - start_time
    print(f"   [OK] {total_rows} registros processados em {elapsed:.2f}s.")
    return total_rows


def run_seed():
    if not DB_PATH.exists():
        print(f"Erro: Banco de dados {DB_PATH} não encontrado. Execute as migrações primeiro.")
        sys.exit(1)

    print(f"Iniciando Seed Database em {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Otimizações de performance para carga em lote
    cursor.execute("PRAGMA synchronous = OFF")
    cursor.execute("PRAGMA journal_mode = MEMORY")
    cursor.execute("PRAGMA foreign_keys = OFF")

    try:
        # 1. dim_genres
        def transform_genre(r):
            return (clean_str(r["sk_genre_id"]), clean_str(r["nome_genero"]))

        seed_table(
            cursor,
            DATA_DIR / "dim_genres.csv",
            "dim_genres",
            ["sk_genre_id", "nome_genero"],
            transform_genre,
        )

        # 2. dim_companies
        def transform_company(r):
            return (clean_str(r["sk_company_id"]), clean_str(r["nome_produtora"]))

        seed_table(
            cursor,
            DATA_DIR / "dim_companies.csv",
            "dim_companies",
            ["sk_company_id", "nome_produtora"],
            transform_company,
        )

        # 3. dim_people
        def transform_person(r):
            tipo = clean_str(r["tipo_pessoa"])
            if tipo not in ("Ator", "Diretor", "Roteirista"):
                return None
            return (clean_str(r["sk_person_id"]), clean_str(r["nome_pessoa"]), tipo)

        seed_table(
            cursor,
            DATA_DIR / "dim_people.csv",
            "dim_people",
            ["sk_person_id", "nome_pessoa", "tipo_pessoa"],
            transform_person,
        )

        # 4. dim_movies
        def transform_movie(r):
            return (
                clean_str(r["sk_movie_id"]),
                str(clean_str(r["id_filme"])),
                clean_str(r["titulo"]),
                clean_date(r.get("data_lancamento")),
                clean_int(r.get("ano_lancamento")),
                clean_int(r.get("duracao_minutos")),
                clean_str(r.get("status_filme")),
                clean_str(r.get("sinopse")),
                clean_str(r.get("url_poster")),
                clean_str(r.get("url_backdrop")),
            )

        seed_table(
            cursor,
            DATA_DIR / "dim_movies.csv",
            "dim_movies",
            [
                "sk_movie_id",
                "id_filme",
                "titulo",
                "data_lancamento",
                "ano_lancamento",
                "duracao_minutos",
                "status_filme",
                "sinopse",
                "url_poster",
                "url_backdrop",
            ],
            transform_movie,
        )

        # 5. bridge_movie_genre
        def transform_bridge_genre(r):
            return (clean_str(r["sk_movie_id"]), clean_str(r["sk_genre_id"]))

        seed_table(
            cursor,
            DATA_DIR / "bridge_movie_genre.csv",
            "bridge_movie_genre",
            ["sk_movie_id", "sk_genre_id"],
            transform_bridge_genre,
        )

        # 6. bridge_movie_company
        def transform_bridge_company(r):
            return (clean_str(r["sk_movie_id"]), clean_str(r["sk_company_id"]))

        seed_table(
            cursor,
            DATA_DIR / "bridge_movie_company.csv",
            "bridge_movie_company",
            ["sk_movie_id", "sk_company_id"],
            transform_bridge_company,
        )

        # 7. bridge_movie_person
        def transform_bridge_person(r):
            return (clean_str(r["sk_movie_id"]), clean_str(r["sk_person_id"]))

        seed_table(
            cursor,
            DATA_DIR / "bridge_movie_person.csv",
            "bridge_movie_person",
            ["sk_movie_id", "sk_person_id"],
            transform_bridge_person,
        )

        # 8. fact_movies_performance
        def transform_fact(r):
            return (
                clean_str(r["sk_movie_id"]),
                clean_float(r.get("orcamento_usd")),
                clean_float(r.get("receita_usd")),
                clean_float(r.get("lucro_usd")) or 0.0,
                clean_float(r.get("orcamento_brl")),
                clean_float(r.get("receita_brl")),
                clean_float(r.get("lucro_brl")) or 0.0,
                clean_float(r.get("popularidade")),
                clean_float(r.get("nota_tmdb")),
                clean_int(r.get("qtd_tmdb")),
                clean_float(r.get("nota_imdb")),
                clean_int(r.get("qtd_imdb")),
            )

        seed_table(
            cursor,
            DATA_DIR / "fact_movies_performance.csv",
            "fact_movies_performance",
            [
                "sk_movie_id",
                "orcamento_usd",
                "receita_usd",
                "lucro_usd",
                "orcamento_brl",
                "receita_brl",
                "lucro_brl",
                "popularidade",
                "nota_tmdb",
                "qtd_tmdb",
                "nota_imdb",
                "qtd_imdb",
            ],
            transform_fact,
        )

        # 9. dim_reviews
        def transform_dim_reviews(r):
            return (
                clean_str(r["sk_review_id"]),
                clean_str(r["sk_movie_id"]),
                clean_int(r.get("qtd_avaliacoes_usuarios")) or 0,
                clean_float(r.get("nota_media_usuarios")),
            )

        seed_table(
            cursor,
            DATA_DIR / "dim_reviews.csv",
            "dim_reviews",
            [
                "sk_review_id",
                "sk_movie_id",
                "qtd_avaliacoes_usuarios",
                "nota_media_usuarios",
            ],
            transform_dim_reviews,
        )

        # 10. movies_reviews
        def transform_reviews(r):
            nota = clean_float(r.get("nota"))
            if nota is None or nota < 0 or nota > 10:
                return None
            return (
                clean_str(r["sk_movie_review_id"]),
                clean_str(r["sk_movie_id"]),
                clean_str(r.get("nome")),
                nota,
                clean_str(r.get("comentario")),
            )

        seed_table(
            cursor,
            DATA_DIR / "movies_reviews.csv",
            "movie_reviews",
            [
                "sk_movie_review_id",
                "sk_movie_id",
                "nome",
                "nota",
                "comentario",
            ],
            transform_reviews,
        )

        # Aplicar correções analíticas e visuais conhecidas (posters, popularidade real e diretores)
        cursor.executescript(
            """
            -- =========================================================================
            -- 1. CORREÇÃO DAS URLs DE PÔSTER E BACKDROP (dim_movies)
            -- =========================================================================

            -- 1.1 La Fellinette (809905)
            UPDATE dim_movies
            SET url_poster = 'https://image.tmdb.org/t/p/w500/ucpXEoOwkk2ggi2bEeXnmUV4aKj.jpg',
                url_backdrop = 'https://image.tmdb.org/t/p/w1280/aRslZdNw2mi57lvV2TABgZtqDdQ.jpg'
            WHERE id_filme = '809905';

            -- 1.2 The Fear Footage 2: Curse of the Tape (658829)
            UPDATE dim_movies
            SET url_poster = 'https://image.tmdb.org/t/p/w500/xbbQ6AEKTWvQ3OG7AFjIwcyyrfz.jpg',
                url_backdrop = 'https://image.tmdb.org/t/p/w1280/cL8ASiD6oFvXBMlhpvslTG30NXH.jpg'
            WHERE id_filme = '658829';

            -- 1.3 WWE Survivor Series 2018 (557809)
            UPDATE dim_movies
            SET url_poster = 'https://image.tmdb.org/t/p/w500/wWF0DscGaKZik8oBw7UgjU6xUMY.jpg',
                url_backdrop = 'https://image.tmdb.org/t/p/w1280/itN9Vem3PLQXq5rkpY0g7lGtFu2.jpg'
            WHERE id_filme = '557809';

            -- 1.4 Battipaglia 1969 (418746)
            UPDATE dim_movies
            SET url_poster = 'https://www.cinemaitaliano.info/show_img.php?type=fotonotizie&id=46660&resize=yes&wi=600&he=800'
            WHERE id_filme = '418746';


            -- =========================================================================
            -- 2. CORREÇÃO DA POPULARIDADE REAL (fact_movies_performance)
            -- Remove os anos vazados (2020, 2019, 2018, 1969) e grava o valor real do TMDb
            -- =========================================================================

            -- 2.1 La Fellinette (Popularidade real = 0.767)
            UPDATE fact_movies_performance
            SET popularidade = 0.767
            WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '809905');

            -- 2.2 The Fear Footage 2 (Popularidade real = 1.716)
            UPDATE fact_movies_performance
            SET popularidade = 1.716
            WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '658829');

            -- 2.3 WWE Survivor Series 2018 (Popularidade real = 2.611)
            UPDATE fact_movies_performance
            SET popularidade = 2.611
            WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '557809');

            -- 2.4 Battipaglia 1969 (Popularidade real = 0.600)
            UPDATE fact_movies_performance
            SET popularidade = 0.600
            WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '418746');


            -- =========================================================================
            -- 3. CORREÇÃO DOS DIRETORES NO CARD
            -- Corrige o campo "Dir: Italy" e "Dir: United States Of America" exibido na UI
            -- =========================================================================

            -- La Fellinette: Francesca Fabbri Fellini é a Diretora (não "Italy")
            UPDATE dim_people
            SET tipo_pessoa = 'Diretor'
            WHERE nome_pessoa = 'Francesca Fabbri Fellini'
              AND sk_person_id IN (
                  SELECT sk_person_id FROM bridge_movie_person
                  WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '809905')
              );

            DELETE FROM bridge_movie_person
            WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '809905')
              AND sk_person_id IN (SELECT sk_person_id FROM dim_people WHERE nome_pessoa = 'Italy');

            -- The Fear Footage 2: Ricky Umberger é o Diretor (não "United States Of America")
            -- 1. Remove "United States Of America" da bridge
            DELETE FROM bridge_movie_person
            WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '658829')
              AND sk_person_id IN (
                  SELECT sk_person_id FROM dim_people WHERE nome_pessoa = 'United States Of America'
              );

            -- 2. Conecta Ricky Umberger como Diretor ao filme
            INSERT OR IGNORE INTO bridge_movie_person (sk_movie_id, sk_person_id)
            SELECT m.sk_movie_id, p.sk_person_id
            FROM dim_movies m, dim_people p
            WHERE m.id_filme = '658829'
              AND p.nome_pessoa = 'Ricky Umberger'
              AND p.tipo_pessoa = 'Diretor';

            -- 3. Atualização defensiva caso o registro de diretor ainda não existisse
            UPDATE dim_people
            SET tipo_pessoa = 'Diretor'
            WHERE nome_pessoa = 'Ricky Umberger'
              AND NOT EXISTS (
                  SELECT 1 FROM dim_people
                  WHERE nome_pessoa = 'Ricky Umberger' AND tipo_pessoa = 'Diretor'
              )
              AND sk_person_id IN (
                  SELECT sk_person_id FROM bridge_movie_person
                  WHERE sk_movie_id = (SELECT sk_movie_id FROM dim_movies WHERE id_filme = '658829')
              );
            """
        )

        conn.commit()
        print("\nSeed finalizado com sucesso e transação commitada!")

    except Exception as e:
        conn.rollback()
        print(f"\n[ERRO] Falha durante a ingestão: {e}")
        raise
    finally:
        cursor.execute("PRAGMA foreign_keys = ON")
        conn.close()


if __name__ == "__main__":
    run_seed()
