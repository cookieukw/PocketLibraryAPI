## Uso da API 
  
 ### Obtendo lista de livros/pesquisa 
  
 > Método GET 
 ``` 
 http://localhost:3000/api/books 
 ``` 
  
 <br> 
  
 > Método GET 
 ``` 
 http://localhost:3000/api/books?<parâmetro>=<valor>&<outro_parâmetro>=<outro_valor> 
 ``` 
 >> Obviamente, remova as tags <> na hora de utilizar e com os parâmetros/valores corretos. 
 >>  
 <br> 
  
 **Estrutura de dados** 
  
 ``` 
 //request normal 
 //http://localhost:3000/api/books 
 // Itens ocultos para poupar espaço  
 [{ 
 "title":"Avaliação da reação em...", 
 "author":"Danielle Bastos Araujo", 
 "font":"Programas de Pós-graduação da CAPES", 
 "id":"83513", 
 "size":"407,36 KB", 
 "sizeByBytes":417136, 
 "format":".pdf" 
 }, 
 ...] 
  
 //Request procurando um autor inexistente 
 //http://localhost:3000/api/books?authorName=nKsdkodpqlsmzwp 
 [] 
 ``` 
  
 <br> 
  
 > Método  GET 
  
 ``` 
 http://localhost:3000/api/book/<ID_LIVRO> 
 ``` 
  
 **Estrutura de dados** 
 ``` 
 //Id inexistente  
 // http://localhost:3000/api/book/019393939393 
 { 
 "error":"No data found for the given ID." 
 } 
  
 //String como id 
 //http://localhost:3000/api/book/8abc8 
 { 
 "error":"Invalid or missing numeric ID parameter." 
 } 
  
 //ID existente e numérica 
 //http://localhost:3000/api/book/83513 
 { 
 "downloadUrl":"informação indisponível", 
 "title":"título aqui", 
 "author":"Danielle Bastos Araujo", 
 "category":"teses e dissertações", 
 "language":"português", 
 "intitutionOrPartner":"...", 
 "institutionOrProgram":"...", 
 "knowledgeArea":"MEDICINA VETERINÁRIA", 
 "level":"Mestrado", 
 "thesisYear":"2007", 
 "acesses":"4.964", 
 "absctract":"..." 
 } 
  
 //As informações ocultas são para reduzir o tamanho do texto 
 ``` 
  
 > Se você quiser acessar a url de download sem nenhum problema, basta passar alguns headers no request da url: 
 ``` 
 const options = {   
    headers: {   
      'User-Agent': '<user_agent>',   
      "Cookie":"JSESSIONID=<uma_id_aleatoria>",  
      'Accept': '/',  
      'Connection': 'keep-alive'  
    }   
  };  
 ``` 
  
  
 ### Parâmetros 
  
 #### itemsSize 
  
 - **parâmetro original: first** 
  
 > Descrição: Esse parâmetro corresponde à quantidade de itens a serem retornados na pesquisa. O valor padrão é 10. 
  
 #### skipItems 
  
 - **parâmetro original: skip** 
  
 > Descrição: Esse parâmetro permite pular uma quantidade específica de itens no resultado da pesquisa. O valor padrão é 0. 
  
 #### artwork 
  
 - **parâmetro original: co_obra** 
  
 > Descrição:  Esse parâmetro corresponde ao código da obra a ser pesquisada. O valor enviado será a identificação única da obra(id). 
  
 #### page  
  
 - **parâmetro original: pagina** 
  
 > Descrição: Esse parâmetro corresponde à página da pesquisa de resultados a ser exibida. O valor padrão é 1. 
  
  
 #### media 
  
 - **parâmetro original: co_midia** 
  
 > Descrição: Esse parâmetro corresponde ao tipo de mídia a ser pesquisada. Os valores enviados correspondem aos tipos abaixo: 
  
Categoria| Número | Tipo de mídia
-|-|-
| Administração | 43 | Texto |
| Agronomia | 69 | Texto |
| Arquitetura | 89 | Texto |
| Artes| 20 | Texto |
| Astronomia | 68 | Texto |
| Biologia Geral | 50 | Texto |
| Ciência Política | 74 | Texto |
| Ciência da Computação | 32 | Texto |
| Ciência da Informação | 52 | Texto |
| Ciências da Saúde | 48 | Texto |
| Coleção Educadores | 133 | Texto |
| Comunicação | 80 | Texto |
| Conselho Nacional de Educação - CNE | 95 | Texto |
| Defesa civil | 121 | Texto |
| Direito| 21 | Texto |
| Direitos humanos | 124 | Texto |
| Economia | 73 | Texto |
| Economia Doméstica | 39 | Texto |
| Educação | 44 | Texto |
| Educação - Trânsito | 40 | Texto |
| Educação Física | 58 | Texto |
| Engenharias | 59 | Texto |
| Farmácia | 70 | Texto |
| Filosofia | 54 | Texto |
| Física | 61 | Texto |
| Geociências | 97 | Texto |
| Geografia | 82 | Texto |
| História | 41 | Texto |
| História Geral da África | 132 | Texto |
| Legislação Educacional | 134 | Texto |
| Literatura | 2 | Texto |
| Literatura Infantil | 33 | Texto |
| Literatura de Cordel | 35 | Texto |
| Línguas | 81 | Texto |
| Matemática | 67 | Texto |
| Medicina | 65 | Texto |
| Medicina Veterinária | 86 | Texto |
| Meio Ambiente | 109 | Texto |
| Meteorologia | 119 | Texto |
| Multidisciplinar | 4 | Texto |
| Música | 125 | Texto |
| Psicologia | 30 | Texto |
| Química | 66 | Texto |
| Relações Internacionais | 129 | Texto |
| Saúde Coletiva | 78 | Texto |
| Serviço Social | 85 | Texto |
| Sociologia | 62 | Texto |
| Teologia | 17 | Texto |
| Teses e Dissertações | 57 | Texto |
| Trabalho | 122 | Texto |
| Turismo | 123 | Texto |
| Blues | 22 | Áudio |
| Escola Brasil | 88 | Áudio |
| Hinos | 5 | Áudio |
| Jazz | 24 | Áudio |
| Música Contemporânea | 18 | Áudio |
| Música Erudita | 6 | Áudio |
| Música Erudita Brasileira| 96 | Áudio |
| Música Militar | 26 | Áudio |
| Música Natalina | 7 | Áudio |
| Música Regional | 27 | Áudio |
| Pop Rock| 84 | Áudio |
| Rádio Escola | 79 | Áudio |
| Tome Ciência | 126| Áudio |
| Educação Ambiental | 131| Vídeo |
| FUNAG - Conferência | 12 | Vídeo |
| FUNAG - Curso | 130| Vídeo |
| PROFORMAÇÃO - Programa de Formação de Professores em Exercício| 120| Vídeo |
| Passeios Virtuais | 28 | Vídeo |
| Religião| 118| Vídeo |
| TV Escola - Arte | 103| Vídeo |
| TV Escola - Ciências | 104| Vídeo |
| TV Escola - Com Ciência| 115| Vídeo |
| TV Escola - Como fazer? A Escola | 116| Vídeo |
| TV Escola - Educação Especial | 100| Vídeo |
| TV Escola - Educação Física | 101| Vídeo |
| TV Escola - Escola / Educação | 102| Vídeo |
| TV Escola - Fazendo Escola | 114| Vídeo |
| TV Escola - Geografia | 117| Vídeo |
| TV Escola - História | 106| Vídeo |
| TV Escola - Literatura| 108| Vídeo |
| TV Escola - Língua Portuguesa | 107| Vídeo |
| TV Escola - Matemática| 99 | Vídeo |
| TV Escola - Pluralidade Cultural | 110| Vídeo |
| TV Escola - Sala de Professor | 113| Vídeo |
| TV Escola - Salto para o Futuro | 112| Vídeo |
| TV Escola - Saúde | 111| Vídeo |
| TV Escola - Ética | 105| Vídeo |
| Fotografia | 19 | Imagem|
| Gravura| 38 | Imagem|
| Ilustração | 8 | Imagem|
| Litografia | 56 | Imagem|
| Mapa | 9 | Imagem|
| Pintura (uso educacional e não-comercial)| 10 | Imagem|
| Recortes| 36 | Imagem|
| Satélite| 11 | Imagem|
  
 #### category 
  
 - **parâmetro original: co_categoria** 
  
 > Descrição: Esse parâmetro corresponde à categoria da obra. Os valores enviados correspondem às categorias selecionadas: 
  
 | Valor | Categoria | 
 | --- | --- | 
 | 19 | Fotografia | 
 | 38 | Gravura | 
 | 8 | Ilustração | 
 | 56 | Litografia | 
 | 9 | Mapa | 
 | 10 | Pintura (uso educacional e não-comercial) | 
 | 36 | Recortes | 
 | 11 | Satélite | 
  
 #### codeAuthor 
  
 - **parâmetro original: co_autor** 
  
 > Descrição: Esse parâmetro corresponde ao código do autor da obra. 
  
 #### authorName 
  
 - **parâmetro original: no_autor** 
  
 > Descrição: Esse parâmetro corresponde ao nome do autor da obra. 
  
 #### title 
  
 - **parâmetro original: ds_titulo** 
  
 > Descrição: Esse parâmetro corresponde ao título da obra. 
  
 #### language 
  
 - **parâmetro original: co_idioma** 
  
 > Descrição:  Esse parâmetro corresponde ao idioma da obra. Os valores enviados correspondem aos idiomas selecionados: 
  
 | Valor | Idioma | 
 | --- | --- | 
 | 11 | Alemão | 
 | 18 | Dinamarquês | 
 | 7 | Espanhol | 
 | 12 | Esperanto | 
 | 19 | Finlandês | 
 | 10 | Francês | 
 | 8 | Galego | 
 | 17 | Holandês | 
 | 2 | Inglês | 
 | 15 | Italiano | 
 | 9 | Latim | 
 | 14 | Norueguês | 
 | 5 | Não Aplicável | 
 | 1 | Português | 
 | 16 | Russo | 
 | 13 | Sueco | 
 | 21 | Sânscrito | 
  
 #### order 
  
 - **parâmetro original: ordem** 
  
 > Descrição: Esse parâmetro determina a direção da ordenação dos resultados da pesquisa. Os tipos de ordenamento são:  
  
 | Valor | Descrição | 
 | --- | --- | 
 | asc | Ordem crescente (do menor para o maior valor) | 
 | desc | Ordem decrescente (do maior para o menor valor) | 
  
 #### filterBy 
  
 - **parâmetro original: colunaOrdenar** 
  
 > Descrição: Esse parâmetro corresponde à coluna na base de dados para ordenação dos resultados da pesquisa. Os valores possiveis são: 
  
 | Valor | Descrição | 
 | --- | --- | 
 | DS_TITULO | Ordenar por título da obra | 
 | NO_AUTOR | Ordenar por nome do autor | 
 | DS_INSTITUICAO | Ordenar por fonte ou instituição | 
 | DS_FORMATO | Ordenar por formato da obra | 
 | NU_TAMANHO | Ordenar pelo tamanho do arquivo | 
 | NU_PAGE_HITS | Ordenar pelo número de acessos | 
  
 ## Sobre a API e sua história  
  
 No ano de 2022, tive que selecionar um tema para o meu projeto que estivesse relacionado a algum problema na sociedade. Refleti profundamente sobre diversas questões, como antigravidade e viagem espacial, entre outros tópicos. No entanto, neste TCC, era exigido que entregássemos um tipo de protótipo, juntamente com uma possível solução para o problema que o projeto pretendia "resolver". 
  
 Dado o grau de complexidade desses problemas e minha falta de expertise científica, optei por procurar problemas mais específicos, nos quais eu pudesse criar soluções com facilidade. Recordando minha experiência em uma escola onde fiz um curso técnico, me lembrei de uma biblioteca inativa por falta de um bibliotecário dedicado, o que me levou a identificar o problema da "disponibilidade de livros". Ao mesmo tempo, surgiu a ideia de criar "aplicativos de eBooks". 
  
 Para resolver de maneira mínima o problema da disponibilidade, bastava que os livros fossem acessíveis de alguma forma, certo? Tive a brilhante ideia de desenvolver um aplicativo de livros para o meu TCC, com o intuito de promover a leitura, uma vez que esse hábito tem diminuído ao longo dos anos. Com esse objetivo em mente e durante minhas pesquisas, descobri um site chamado [Domínio Público](http://www.dominiopublico.gov.br/pesquisa/PesquisaObraForm.jsp). 
  
 A partir desse ponto, comecei a buscar por sites que disponibilizassem livros em domínio público, a fim de evitar questões de direitos autorais, pirataria e plágio. Encontrei um site que oferece uma vasta coleção de obras, TCCs, teses e mais, todos em domínio público, permitindo que as pessoas os lessem. 
  
 Apesar do site apresentar um design desatualizado e pouco agradável, ele possui uma grande quantidade de obras, o que chamou minha atenção. Isso se alinhava perfeitamente ao que eu estava buscando. Considerando minha habilidade em programação, decidi criar esse aplicativo. 
  
 Estudei o funcionamento do site e desenvolvi scripts para baixar os livros, inclusive gerando imagens a partir dos PDFs. Armazenei tudo em um banco de dados para ser utilizado no aplicativo, construindo-o gradualmente. Ao final, criei um aplicativo com cerca de 2 mil livros e obtive aprovação. 
  
 Chegou o ano de 2023, e eu desejava dar continuidade a esse projeto, pois a ideia ainda era muito válida e não queria que caísse no esquecimento. Assim, decidi elaborar algo mais complexo, surgindo assim esse novo projeto. 
  
 Apresento a você esta API **NÃO OFICIAL**, que realiza um scraping no site mencionado anteriormente, evitando a necessidade de armazenamento e proporcionando velocidade. Além disso, a API faz requisições de forma similar a um acesso humano normal (evitando riscos de sobrecarga de requisições), e a Vercel fará novas requisições em intervalos, mantendo os dados disponíveis por um período de 30 dias(sujeito a alterações). 
  
 A API é de fácil utilização e utiliza os próprios parâmetros do site. Ela pode ser empregada para criar sites, aplicativos e muito mais.