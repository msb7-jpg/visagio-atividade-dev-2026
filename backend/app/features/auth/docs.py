from app.features.auth.schemas import AdminUserDTO, TokenResponse
from app.shared.docs import EndpointsDocs

LoginDocs = EndpointsDocs(
    response_model=TokenResponse,
    summary="Login administrativo",
    description="Autentica o administrador com e-mail e senha retornando um Bearer Token JWT.",
)

MeDocs = EndpointsDocs(
    response_model=AdminUserDTO,
    summary="Identificação do administrador logado",
    description="Retorna os dados do administrador atual autenticado via token JWT.",
)