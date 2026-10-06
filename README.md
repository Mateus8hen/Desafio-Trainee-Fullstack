# Desafio Técnico - Trainee Fullstack (JavaScript/TypeScript)

## Objetivo

Queremos avaliar suas habilidades em aplicações web com **Node.js**, **React** e **PostgreSQL**, além da sua capacidade de organizar o código, testá-lo e documentá-lo.

Você vai desenvolver um **Analisador de Documentos**: um portal em que usuários do escritório cadastram textos jurídicos (trechos de contratos, notificações, decisões etc.) e geram uma **análise automática** de cada um, com classificação, resumo e pontos de atenção.

Não esperamos um sistema perfeito. Um projeto menor, bem feito e bem documentado vale mais do que um projeto grande e desorganizado.

**Importante:** use apenas dados fictícios. Não cadastre documentos reais, nomes reais ou dados pessoais de terceiros.

## Instruções

1. Faça um **fork** deste repositório para a sua conta do GitHub.
2. Desenvolva a solução **no seu fork**, versionando com Git ao longo do desenvolvimento: commits pequenos, com mensagens claras. Recomendamos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `test:`, `docs:`...).
3. Trabalhe em uma **branch** separada e, ao final, abra um **Pull Request** para a `main` do seu próprio fork, descrevendo o que foi feito.
4. Envie o link do seu fork para **dellareti.invest@gmail.com** e **rafaelaaraujo.investleiloes@gmail.com**, informando seu nome e alguma informação extra necessária. 
5. **Prazo:** até **14 de outubro de 2026**.

O histórico de commits também faz parte da avaliação.

## Requisitos

### Módulo: Usuários

**Página - Cadastro**
- Formulário com nome, e-mail e senha
- Validações:
  - **nome:** obrigatório, até 100 caracteres
  - **e-mail:** obrigatório, em formato de e-mail válido
  - **senha:** obrigatória, no mínimo 8 caracteres
- Exibir mensagem de erro caso o e-mail já esteja cadastrado
- Endpoint: `POST /auth/cadastro`, respondendo `201` com o usuário criado, no mesmo formato de `usuario` do login: `{ "id": 1, "nome": "Ana Souza", "email": "ana@exemplo.com" }`
- E-mail já cadastrado: `409`

**Página - Login**
- Login por e-mail e senha
- Após o login, o usuário é direcionado para a lista de documentos
- Permitir logout
- Endpoint: `POST /auth/login`, respondendo `200` com um token (ex.: JWT) e os dados do usuário:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": 1, "nome": "Ana Souza", "email": "ana@exemplo.com" }
}
```

- E-mail inexistente ou senha incorreta: `401`, com a mesma mensagem nos dois casos

**Regras**
- A senha nunca deve ser salva em texto puro (use hash, ex.: `bcrypt`) nem retornada em nenhuma resposta da API
- O e-mail deve ser único sem diferenciar maiúsculas de minúsculas: salve-o em minúsculas e converta para minúsculas antes de comparar, no cadastro e no login (`Ana@Exemplo.com` e `ana@exemplo.com` são o mesmo e-mail)
- Os endpoints autenticados recebem o token no cabeçalho `Authorization: Bearer <token>`

### Módulo: Documentos (precisa estar logado)

Todas as páginas e endpoints deste módulo exigem autenticação. Usuário não autenticado deve ser redirecionado para o login no front-end e receber `401` na API.

**Página - Lista de Documentos**
- Listar todos os documentos, do mais recente para o mais antigo
- Permitir inverter a ordenação
- Permitir filtrar apenas os documentos do usuário logado
- Exibir título, autor, data de criação e tipo (se já analisado)
- Endpoint: `GET /documentos?ordem=desc|asc&meus=true|false`
  - `ordem`: `desc` (padrão) ou `asc`, pela data de criação
  - `meus`: `false` (padrão) ou `true`
  - Qualquer outro valor nesses parâmetros: `400`
- Resposta `200`:

```json
[
  {
    "id": 7,
    "titulo": "Contrato de locação - Rua das Acácias",
    "autor": { "id": 1, "nome": "Ana Souza" },
    "criado_em": "2026-10-06T14:30:00.000Z",
    "tipo": "contrato"
  }
]
```

`tipo` é `null` quando o documento ainda não foi analisado.

**Página - Detalhes do Documento**
- Exibir título, conteúdo, autor, datas de criação e atualização
- Exibir a análise do documento, se houver
- Exibir os botões de editar, remover e analisar **apenas para o autor** (compare o `autor.id` do documento com o `usuario.id` recebido no login)
- Endpoint: `GET /documentos/:id`, resposta `200`:

```json
{
  "id": 7,
  "titulo": "Contrato de locação - Rua das Acácias",
  "conteudo": "CONTRATO DE LOCAÇÃO RESIDENCIAL\n\nPelo presente instrumento...",
  "autor": { "id": 1, "nome": "Ana Souza" },
  "criado_em": "2026-10-06T14:30:00.000Z",
  "atualizado_em": "2026-10-06T14:30:00.000Z",
  "analise": {
    "tipo": "contrato",
    "resumo": "CONTRATO DE LOCAÇÃO RESIDENCIAL Pelo presente instrumento...",
    "pontos_de_atencao": ["..."],
    "analisador": "regras",
    "criado_em": "2026-10-06T14:31:00.000Z"
  }
}
```

`analise` é `null` quando o documento ainda não foi analisado.

**Página - Formulário de Documento** (criação e edição)
- Campos:
  - **título:** campo de uma linha, obrigatório, até 200 caracteres
  - **conteúdo:** campo de texto **multilinha** (`textarea`), obrigatório, até 50.000 caracteres. O usuário digita ou cola o texto do documento
- O conteúdo deve ser salvo **exatamente como foi enviado**, preservando quebras de linha e espaços. Não aplique `trim` nem qualquer outra alteração
- Título ou conteúdo vazios ou formados apenas por espaços em branco, incluindo quebras de linha (em JavaScript: `/^\s*$/.test(valor)`): `400`
- O mesmo componente de formulário deve ser reutilizado na criação e na edição
- Endpoints:
  - `POST /documentos`: recebe `titulo` e `conteudo` e responde `201` com o documento criado
  - `PUT /documentos/:id`: recebe **sempre os dois campos**, `titulo` e `conteudo`, e responde `200` com o documento atualizado
  - As respostas dos dois têm o mesmo formato de `GET /documentos/:id`

**Remoção**
- Pedir confirmação antes de remover
- Endpoint: `DELETE /documentos/:id`, respondendo `204`

**Regras**
- Somente o **autor** pode editar, remover ou analisar o documento. Para os demais usuários, a API deve retornar `403`
- Documento inexistente: `404`
- No `PUT`, se o `conteudo` enviado for **diferente** do salvo (comparação exata), a análise existente é apagada e o documento volta a ter `analise: null`. Se o `conteudo` for **igual** ao salvo, a análise é mantida, mesmo que o título mude
- Ao remover um documento, a análise dele também é removida

### Módulo: Análise (precisa estar logado)

**Serviço - Analisador de Documentos**

Crie um serviço que recebe o texto de um documento e devolve uma análise neste formato (saída do exemplo [`exemplos/01-contrato-locacao.txt`](exemplos/01-contrato-locacao.txt)):

```json
{
  "tipo": "contrato",
  "resumo": "CONTRATO DE LOCAÇÃO RESIDENCIAL Pelo presente instrumento, de um lado Marcos Vieira Lopes, doravante denominado LOCADOR, e de outro Ana Paula Ferreira, doravante denominada LOCATÁRIA, têm entre si justo e contratado o seguinte.",
  "pontos_de_atencao": [
    "CLÁUSULA SEGUNDA - O prazo de vigência da locação é de 30 meses, com início em 1 de fevereiro de 2026.",
    "O atraso no pagamento implicará multa de 10% sobre o valor devido, acrescida de juros de 1% ao mês.",
    "CLÁUSULA QUARTA - Em caso de rescisão antecipada pela LOCATÁRIA, será devida multa equivalente a 3 aluguéis, proporcional ao tempo restante do contrato."
  ]
}
```

Nesta versão, a análise é feita por **regras fixas**, sem nenhuma API externa. As regras e o glossário abaixo são **obrigatórios** e devem ser seguidos exatamente: o mesmo texto de entrada deve sempre gerar a mesma saída.

#### Regra 0 - Entrada e definições

1. O analisador recebe **apenas o campo `conteudo`** do documento (sem o título), exatamente como está salvo.
2. Antes de aplicar as demais regras, prepare o texto nesta ordem:
   1. Converta para a forma Unicode NFC: `texto.normalize('NFC')`.
   2. Troque toda quebra de linha `\r\n` ou `\r` por `\n`.
3. Nestas regras:
   - **espaço** é qualquer caractere de espaço em branco **exceto `\n`**: espaço comum, tab, espaço não separável (comum em texto copiado do Word) etc. Em expressão regular do JavaScript: `[^\S\n]`;
   - **caractere** é um code point Unicode. Em JavaScript, conte com `Array.from(texto).length`, e não com `texto.length`.

#### Regra 1 - Comparação de termos

Para verificar se um termo do glossário aparece em uma frase:

1. **Normalize** a frase e o termo, nesta ordem:
   1. `normalize('NFD')`;
   2. remova os caracteres de U+0300 a U+036F, que são os acentos e a cedilha;
   3. converta para minúsculas.

   Assim, `Cláusula` vira `clausula` e `NOTIFICAÇÃO` vira `notificacao`.
2. O termo só conta se aparecer como **palavra ou expressão inteira**: o caractere imediatamente antes e o imediatamente depois dele, na frase normalizada, não podem estar em `a-z` nem em `0-9`. Também conta se o termo estiver no início ou no fim da frase.
   - `requer` **casa** com "Requer ainda a condenação", mas **não casa** com "requerimento" nem com "requerente".
   - `prazo` **não casa** com "prazos". Por isso as variações necessárias já estão listadas no glossário.

#### Regra 2 - Divisão em frases

1. Divida o texto em **linhas** pelo caractere `\n`.
2. Divida cada linha em frases **depois** de `.`, `!` ou `?` quando esse sinal for seguido de um ou mais espaços. O sinal fica na frase.
3. Em cada frase, remova os espaços do início e do fim e troque cada sequência de espaços por um único espaço comum (`" "`).
4. Descarte as frases que ficarem vazias. Isso inclui linhas vazias ou formadas só por espaços.

Assim, um título em linha própria (ex.: "CONTRATO DE LOCAÇÃO RESIDENCIAL") é uma frase, e "Publique-se. Registre-se. Intimem-se." são três frases. Pontos que não são seguidos de espaço (ex.: `R$ 2.500,00`) não dividem a frase.

Abreviações como "Art. 5º" ou "Sr. João" também dividem a frase. Esse comportamento é **intencional**: não tente corrigi-lo.

#### Regra 3 - Campo `tipo`

1. Para cada tipo do glossário, conte quantos **termos diferentes** daquele tipo aparecem em **pelo menos uma frase** (Regra 2). Um termo que aparece várias vezes conta uma vez só.
2. O tipo com a **maior contagem** vence.
3. Em caso de empate, vence o que vem primeiro nesta ordem de prioridade: `decisao`, `peticao`, `notificacao`, `contrato`.
4. Se nenhum termo de nenhum tipo aparecer, o tipo é `outro`.

Os valores possíveis de `tipo` são exatamente `contrato`, `peticao`, `decisao`, `notificacao` e `outro`: identificadores fixos, sem acento.

Exemplo de empate: "O requerente juntou a sentença." tem 1 termo de `peticao` (requerente) e 1 de `decisao` (sentença), então o tipo é `decisao`.

#### Regra 4 - Campo `resumo`

1. Junte as **duas primeiras frases** (Regra 2) com um espaço comum entre elas. Se houver só uma frase, use apenas ela. Se não houver nenhuma, o resumo é `""`.
2. Se o resultado tiver **mais de 300 caracteres**, mantenha os 297 primeiros, remova os espaços do final e acrescente `...`.

#### Regra 5 - Campo `pontos_de_atencao`

1. Inclua cada frase (Regra 2) que contenha **pelo menos um** termo de atenção do glossário.
2. Mantenha a **ordem em que aparecem** no texto e não repita frases idênticas.
3. Se nenhuma frase tiver termos de atenção, retorne uma lista vazia `[]`.

#### Glossário

**Termos de tipo**

| Tipo | Termos |
|---|---|
| `contrato` | contratante, contratada, contratado, cláusula, pelo presente instrumento, vigência, locador, locadora, locatário, locatária |
| `peticao` | excelentíssimo, excelentíssima, vem respeitosamente, requerente, requerido, requerida, requer, nestes termos, pede deferimento |
| `decisao` | sentença, julgo, condeno, publique-se, registre-se, intimem-se, trânsito em julgado |
| `notificacao` | notificação extrajudicial, notificante, notificado, notificada, notificamos |

**Termos de atenção**

| Termo | Por que merece atenção |
|---|---|
| multa, multas | Penalidade financeira por descumprimento |
| prazo, prazos | Datas que, se perdidas, geram perda de direito ou penalidade |
| rescisão | Encerramento do contrato e suas consequências |
| juros | Encargo que aumenta o valor devido com o tempo |
| correção monetária | Atualização do valor devido |
| penalidade | Sanção prevista no documento |
| indenização | Valor a pagar ou a receber por dano |
| despejo | Risco de perda da posse do imóvel |
| honorários | Custo com advogados, inclusive da parte contrária |

#### Exemplos obrigatórios

A pasta [`exemplos/`](exemplos/) tem **6 documentos fictícios** (`.txt`) e a **saída esperada** de cada um (`.esperado.json`):

- **01 a 05:** um documento comum para cada tipo, incluindo `outro`
- **06:** casos de borda das regras acima, com caracteres invisíveis (tab, espaço não separável, quebras de linha `\r\n` e `\r`, acentos em NFD e emojis)

O passo a passo de cada exemplo, com a explicação do que o 06 testa, está em [`exemplos/README.md`](exemplos/README.md).

O conteúdo de cada `.txt` corresponde ao campo `conteudo` de um documento. O seu analisador por regras deve produzir **exatamente** essas saídas, e isso deve ser verificado por **testes automatizados** que leem os arquivos diretamente da pasta `exemplos/`, sem copiá-los nem alterá-los.

**Por que uma abstração?** No escritório, esse tipo de análise é feito com modelos de linguagem (LLMs). Por isso, o analisador deve ser construído como uma **interface com uma implementação trocável**: o resto da aplicação depende apenas do contrato "recebe o `conteudo`, devolve `{ tipo, resumo, pontos_de_atencao }`" e não sabe se a análise vem de regras ou de uma IA. Trocar o analisador por regras por um analisador com IA não deve exigir mudanças nas rotas, no banco ou no front-end. A implementação usada pode ser escolhida por variável de ambiente (ex.: `ANALISADOR=regras`).

**Endpoint**
- `POST /documentos/:id/analise`: executa o analisador, salva o resultado no banco e responde `201` com a análise, no mesmo formato do campo `analise` de `GET /documentos/:id`
- Se o documento já tiver uma análise, ela é **substituída** pela nova
- Salvar também **qual analisador** gerou a análise (`"regras"` para o analisador por regras) e **quando**

**Na Página - Detalhes do Documento**
- Botão "Analisar documento" (apenas para o autor)
- Exibir o tipo, o resumo e a lista de pontos de atenção

## Notas

### Tecnologias

- **Back-end:** Node.js (JavaScript ou TypeScript), com Express, Fastify, NestJS ou outro framework de sua preferência
- **Front-end:** React (Vite, Next.js ou similar), com interface **responsiva**. Bibliotecas de UI (Tailwind, MUI, shadcn/ui etc.) são permitidas
- **Banco de dados:** PostgreSQL, com SQL puro, query builder (Knex) ou ORM (Prisma, Drizzle, TypeORM, Sequelize)

### API

- Validar as entradas de todos os endpoints
- Usar status HTTP adequados: `201` na criação, `400` para entrada inválida, `401` sem autenticação, `403` sem permissão, `404` para recurso inexistente e `409` para conflito (ex.: e-mail já cadastrado)
- Retornar todos os erros neste formato:

```json
{
  "erro": "VALIDACAO",
  "mensagem": "O campo 'titulo' é obrigatório."
}
```

| Status | `erro` |
|---|---|
| `400` | `VALIDACAO` |
| `401` | `NAO_AUTENTICADO` |
| `403` | `SEM_PERMISSAO` |
| `404` | `NAO_ENCONTRADO` |
| `409` | `CONFLITO` |

- Datas nas respostas em formato ISO 8601 (ex.: `"2026-10-06T14:30:00.000Z"`)

- Separar responsabilidades. Não exigimos uma arquitetura específica, mas evite misturar rota, regra de negócio, acesso a banco e analisador no mesmo arquivo. Uma divisão como `rotas → controllers → services → repositórios` já é suficiente

### Banco de dados

Modelo mínimo sugerido (você pode adaptar e justificar):

```
usuarios
  id, nome, email (único), senha_hash, criado_em

documentos
  id, titulo, conteudo, autor_id -> usuarios.id, criado_em, atualizado_em

analises
  id, documento_id -> documentos.id, tipo, resumo, pontos_de_atencao,
  analisador, criado_em
```

- Incluir **migrations** ou um script SQL para criar as tabelas do zero
- `pontos_de_atencao` pode ser armazenado como preferir (`jsonb`, `text[]` ou tabela própria), mas a API sempre o retorna como lista

### Front-end

- Rotas internas protegidas
- Estados de **carregamento** e de **erro** nas chamadas à API
- Componentes reutilizáveis
- Não precisa de um design elaborado, uma interface limpa e funcional é suficiente

### Testes

Escreva testes automatizados para o back-end (Jest, Vitest, `node:test` ou similar).

**Obrigatório:**

- O analisador por regras gera exatamente a saída esperada para os 6 documentos da pasta `exemplos/`

**Sugestões** (não exigimos cobertura alta, mas queremos ver que você sabe **o que vale a pena testar**):

- Cadastro com e-mail duplicado retorna `409`
- Usuário não pode editar ou remover documento de outro usuário (`403`)
- A listagem respeita a ordenação e o filtro `meus`

### Documentação

Substitua este README pelo README do seu projeto, contendo:

1. **Como rodar** localmente, passo a passo: pré-requisitos, variáveis de ambiente (inclua um `.env.example`), banco, back-end, front-end e testes. Teste suas instruções do zero antes de entregar
2. **Endpoints da API**, com exemplo de requisição e resposta (tabela, coleção do Postman/Insomnia/Bruno ou Swagger)
3. **Decisões técnicas:** por que escolheu essas bibliotecas e essa organização, e o que faria diferente com mais tempo
4. **Avaliação do analisador:** olhando as saídas dos exemplos 01 a 05, onde as regras fixas acertam e onde produzem um resultado ruim? Por exemplo, o resumo da sentença (`03`) é só o cabeçalho do tribunal. Como um analisador com IA resolveria isso?
5. **O que ficou faltando**, se algo ficou

## Diferenciais

Nenhum destes itens é obrigatório. Faça primeiro o essencial bem feito.

Um diferencial **não pode alterar** os formatos, status e regras obrigatórios descritos acima. Por exemplo: a paginação deve usar parâmetros opcionais, e sem eles `GET /documentos` continua respondendo exatamente como especificado.

- **Analisador com IA:** uma segunda implementação do analisador usando a API de um LLM ([Anthropic Claude](https://docs.claude.com/), [Google Gemini](https://ai.google.dev/) ou [OpenAI](https://platform.openai.com/docs)), selecionável pela mesma variável de ambiente. A resposta do modelo deve ser validada antes de ser salva, e falhas do provedor (timeout, chave inválida, limite de uso) devem ser tratadas. A chave de API nunca pode ser commitada
- **TypeScript** no back-end e/ou no front-end
- **Docker / Docker Compose** subindo banco, API e front-end com um comando
- **Paginação** e **busca por título** na lista de documentos
- **Histórico de análises**: guardar as análises substituídas ou apagadas em um histórico consultável
- **Upload de arquivo** `.txt` ou `.pdf` com extração do texto para o conteúdo do documento
- **Testes no front-end** (Testing Library) ou testes de integração da API com banco real
- **Documentação da API** com Swagger/OpenAPI
- **CI** com GitHub Actions rodando os testes a cada push
- **Deploy** em algum serviço gratuito (Render, Railway, Vercel, Fly.io etc.)

## Como vamos avaliar

| Critério | O que observamos |
|---|---|
| **Funcionamento** | Os requisitos funcionam seguindo o seu passo a passo |
| **Organização do código** | Separação de responsabilidades, nomes claros, ausência de código duplicado ou morto |
| **API** | Validação de entrada, status HTTP corretos, erros consistentes, regras de permissão respeitadas |
| **Banco de dados** | Modelagem, relacionamentos, migrations e consultas |
| **Analisador** | Regras coerentes e interface bem isolada, pronta para receber uma implementação com IA |
| **Testes** | Testam regras que importam e rodam com um comando |
| **Front-end** | Fluxos completos, componentes reutilizáveis, estados de carregamento e erro, responsividade |
| **Git** | Commits pequenos e descritivos, uso de branch e Pull Request |
| **Documentação** | Dá para rodar o projeto só lendo o README; decisões e limitações explicadas |
| **Segurança básica** | Senha com hash, token validado, `.env` fora do repositório, nada sensível commitado |

**O que não esperamos:** design sofisticado, arquitetura complexa ou que todos os diferenciais sejam implementados.

## Dúvidas

Se algo não estiver claro, você pode:

- **Abrir um tópico em [Discussions](https://github.com/dfa-correspondente/Desafio-Trainee-Fullstack/discussions)** deste repositório original. A dúvida de um candidato costuma ser a de outros, e assim a resposta fica disponível para todos. Não publique trechos da sua solução no tópico.
- **Enviar um e-mail** para **dellareti.invest@gmail.com**.

O que este README define (regras do analisador, formatos de resposta e status HTTP) deve ser seguido exatamente. Para o que ele **não** define, você também pode tomar uma decisão, registrá-la no seu README e seguir em frente: saber decidir e justificar também faz parte do desafio.

Boa sorte!
