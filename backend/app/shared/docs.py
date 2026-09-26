from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class EndpointsDocs:
    response_model: Any
    summary: str
    description: str | None = None
    extra_options: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Converte a documentação do endpoint em um dicionário para uso no FastAPI."""
        base: dict[str, Any] = {
            "response_model": self.response_model,
            "summary": self.summary,
        }
        if self.description:
            base["description"] = self.description
        return {**base, **self.extra_options}


EndpointDoc = EndpointsDocs
    
