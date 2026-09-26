


Good to have
TODO - Comportamento da estrela
- ao adicionar uma estrela, nao eh possivel colocar nota zero, mas no banco teoricamente pode, entao isso vai poder ser um comportamento valido, porem caso o usuário nao tenha colocado nada vai vir um dialog de confirmação avisando q ele nao colocou nota e se deseja mesmo continuar com nota zero, e um botao sutil ao lado de remover a avaliação / qtd de estrelas, apenas um x cinza

TODO - no form esta tendo um constraste ruim ao selecionar um genero, a cor do check mal da para aparecer, alem disso a visão expandida nao esta boa, queria realmente uma visao expandida dos posteres q ocupasse boa parte da tela, e sla caso o usuário optasse por ver uma ou ou outra deve ser mais simples, nao precisa de tanto texto como "Visualização em tela expandida de mídia cinematográfica em alta resolução." e pode ser so parecido com uma galeria das duas imagens q ele passa pro lado e ve uma ou a outra, e ai tiramos o segundo botão de Expandir Fundo e deixamos so o expandir poster como um de tp mostrar artes, neste esquema q te falei, mostra a foto grande, as fotos pequenas embaixo e vc pode ir de um lado pro outro, e o tamanho total permanece, na foto 2:3 podemos fazer aquele esquema de as laterais serem a propria foto desfocada entendeu

TODO - quero poder ver as previews das imagens na hora da criação/edição do filme, alem disso gostaria de salvar o estado da criação de um filme no local storage, se eu fechar, voltar, etc, ele salva como rascunho e mostra um pequeno badge ao lado do icone como uma notificacao, indicando q tem um rascunho salvo, ou seja agr para cancelar a criação tb deve ter um confirm dialog dizendo se queremos descartar o rascunho msm, e um pequeno detalhe tb


TODO - melhorias na criação/gerenciamento/visualização dos filmes
- mas adicionar uma opção de visualizar os postes numa tela expandida, o poster e o backdrop
- para deletar um filme, deve ter uma input que o usuário digita o nome completo do filme, junto ao botão de confirmar
- ao preencher a lista de diretores, ao inves de uma iput simples, quero uma input com autocomplete que busca no banco por diretores ja existentes, caso eu mande um q nao exista, da um create
- colocar qualquer outro icone melhor no forms de criar ao inves do sparkles
- quando o usuário digita o link das imagens, devemos fazer um fetch, para verificar q as imagens existem e conseguiram ser buscadas e mostrar um check positivo dentro da input
- aumentar um pouco o tamanho das inputs, as bordas estao excessivamente arredondadas em relaçao
- o botão voltar nao esta voltando corretamente no historio, exemplo eu edito um filme, clico em voltar, ele volta para pagina do filme, clico dps em Voltar ao catálogo, mas ele vola para a última posição do histórico q era a página de edição ao inves de voltar para página inicial

Optionals ->
TODO - adiconar prelaods ao longo do app para deixar mais eficiente
TODO - identificar melhor quais sao componentes "views" que representam uma pagina toda e como dexar eles facilmente visiveis na arquitetura
TODO - ao ir para um filme vc n volta para o topo da pagina
TODO - ao ir para um filme vc nem sempre entra no topo da página dele
TODO - generos tao mal deduplicados, tem um em portuues ali no meio
