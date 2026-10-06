# Exemplos do Analisador de Documentos

Todos os documentos são **fictícios**. Cada arquivo `.txt` é a entrada do analisador (o campo `conteudo` de um documento), e o `.esperado.json` de mesmo nome é a saída que o analisador por regras deve produzir.

Para cada exemplo, mostramos a contagem de termos por tipo (Regra 3) e quais termos foram encontrados, para facilitar a conferência.

Os exemplos 01 a 05 são documentos comuns, um de cada tipo. O exemplo 06 reúne **casos de borda** das regras e contém caracteres invisíveis: leia a explicação dele antes de implementar.

| Arquivo | Tipo esperado | Pontos de atenção |
|---|---|---|
| [01-contrato-locacao.txt](01-contrato-locacao.txt) | `contrato` | 3 |
| [02-peticao-indenizacao.txt](02-peticao-indenizacao.txt) | `peticao` | 4 |
| [03-sentenca-cobranca.txt](03-sentenca-cobranca.txt) | `decisao` | 3 |
| [04-notificacao-aluguel.txt](04-notificacao-aluguel.txt) | `notificacao` | 2 |
| [05-procuracao.txt](05-procuracao.txt) | `outro` | 0 |
| [06-casos-de-borda.txt](06-casos-de-borda.txt) | `decisao` | 6 |

## 1. Contrato de locação

**Entrada:** [01-contrato-locacao.txt](01-contrato-locacao.txt)

```text
CONTRATO DE LOCAÇÃO RESIDENCIAL

Pelo presente instrumento, de um lado Marcos Vieira Lopes, doravante denominado LOCADOR, e de outro Ana Paula Ferreira, doravante denominada LOCATÁRIA, têm entre si justo e contratado o seguinte.

CLÁUSULA PRIMEIRA - O imóvel situado na Rua das Acácias, 120, Belo Horizonte, será utilizado exclusivamente para fins residenciais.

CLÁUSULA SEGUNDA - O prazo de vigência da locação é de 30 meses, com início em 1 de fevereiro de 2026.

CLÁUSULA TERCEIRA - O aluguel mensal é de R$ 2.500,00, com vencimento todo dia 10. O atraso no pagamento implicará multa de 10% sobre o valor devido, acrescida de juros de 1% ao mês.

CLÁUSULA QUARTA - Em caso de rescisão antecipada pela LOCATÁRIA, será devida multa equivalente a 3 aluguéis, proporcional ao tempo restante do contrato.

E por estarem de acordo, as partes assinam o presente em duas vias.
```

**Contagem de termos por tipo:**

| Tipo | Contagem | Termos encontrados |
|---|---|---|
| `contrato` | 6 | contratado, cláusula, pelo presente instrumento, vigência, locador, locatária |
| `peticao` | 0 | - |
| `decisao` | 0 | - |
| `notificacao` | 0 | - |

**Saída esperada:** [01-contrato-locacao.esperado.json](01-contrato-locacao.esperado.json)

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

## 2. Petição inicial de indenização

**Entrada:** [02-peticao-indenizacao.txt](02-peticao-indenizacao.txt)

```text
EXCELENTÍSSIMO SENHOR JUIZ DE DIREITO DA 5ª VARA CÍVEL DA COMARCA DE BELO HORIZONTE

Carla Mendes Rocha, brasileira, empresária, residente em Belo Horizonte, vem respeitosamente, por meio de seu advogado, propor a presente AÇÃO DE INDENIZAÇÃO POR DANOS MATERIAIS em face de Construtora Horizonte Azul Ltda, pelos fatos e fundamentos a seguir expostos.

DOS FATOS

A requerente adquiriu da requerida um apartamento na planta, com entrega prevista para março de 2025. Até a presente data, o imóvel não foi entregue, tendo sido ultrapassado o prazo de tolerância de 180 dias previsto no contrato.

DOS PEDIDOS

Diante do exposto, requer a condenação da requerida ao pagamento de indenização no valor de R$ 48.000,00, correspondente aos aluguéis pagos no período de atraso, acrescida de correção monetária e juros legais. Requer ainda a condenação da requerida ao pagamento das custas processuais e honorários advocatícios.

Nestes termos, pede deferimento.

Belo Horizonte, 15 de setembro de 2026.
```

**Contagem de termos por tipo:**

| Tipo | Contagem | Termos encontrados |
|---|---|---|
| `contrato` | 0 | - |
| `peticao` | 7 | excelentíssimo, vem respeitosamente, requerente, requerida, requer, nestes termos, pede deferimento |
| `decisao` | 0 | - |
| `notificacao` | 0 | - |

**Saída esperada:** [02-peticao-indenizacao.esperado.json](02-peticao-indenizacao.esperado.json)

```json
{
  "tipo": "peticao",
  "resumo": "EXCELENTÍSSIMO SENHOR JUIZ DE DIREITO DA 5ª VARA CÍVEL DA COMARCA DE BELO HORIZONTE Carla Mendes Rocha, brasileira, empresária, residente em Belo Horizonte, vem respeitosamente, por meio de seu advogado, propor a presente AÇÃO DE INDENIZAÇÃO POR DANOS MATERIAIS em face de Construtora Horizonte Az...",
  "pontos_de_atencao": [
    "Carla Mendes Rocha, brasileira, empresária, residente em Belo Horizonte, vem respeitosamente, por meio de seu advogado, propor a presente AÇÃO DE INDENIZAÇÃO POR DANOS MATERIAIS em face de Construtora Horizonte Azul Ltda, pelos fatos e fundamentos a seguir expostos.",
    "Até a presente data, o imóvel não foi entregue, tendo sido ultrapassado o prazo de tolerância de 180 dias previsto no contrato.",
    "Diante do exposto, requer a condenação da requerida ao pagamento de indenização no valor de R$ 48.000,00, correspondente aos aluguéis pagos no período de atraso, acrescida de correção monetária e juros legais.",
    "Requer ainda a condenação da requerida ao pagamento das custas processuais e honorários advocatícios."
  ]
}
```

## 3. Sentença de cobrança

**Entrada:** [03-sentenca-cobranca.txt](03-sentenca-cobranca.txt)

```text
PODER JUDICIÁRIO DO ESTADO DE MINAS GERAIS
Comarca de Belo Horizonte - 12ª Vara Cível
Processo 5001234-56.2026.8.13.0024

SENTENÇA

Trata-se de ação de cobrança ajuizada por Condomínio Edifício Primavera em face de Roberto Alves Pinto, referente a taxas condominiais não pagas entre janeiro e junho de 2026. Citado, o réu não apresentou contestação no prazo legal.

Ante o exposto, JULGO PROCEDENTE o pedido e condeno o réu ao pagamento de R$ 7.200,00, com correção monetária a partir de cada vencimento e juros de mora de 1% ao mês desde a citação. Condeno o réu, ainda, ao pagamento das custas e honorários advocatícios, fixados em 10% do valor da condenação.

Publique-se. Registre-se. Intimem-se.

Belo Horizonte, 22 de setembro de 2026.

Juíza de Direito Fernanda Lima Castro
```

**Contagem de termos por tipo:**

| Tipo | Contagem | Termos encontrados |
|---|---|---|
| `contrato` | 0 | - |
| `peticao` | 0 | - |
| `decisao` | 6 | sentença, julgo, condeno, publique-se, registre-se, intimem-se |
| `notificacao` | 0 | - |

**Saída esperada:** [03-sentenca-cobranca.esperado.json](03-sentenca-cobranca.esperado.json)

```json
{
  "tipo": "decisao",
  "resumo": "PODER JUDICIÁRIO DO ESTADO DE MINAS GERAIS Comarca de Belo Horizonte - 12ª Vara Cível",
  "pontos_de_atencao": [
    "Citado, o réu não apresentou contestação no prazo legal.",
    "Ante o exposto, JULGO PROCEDENTE o pedido e condeno o réu ao pagamento de R$ 7.200,00, com correção monetária a partir de cada vencimento e juros de mora de 1% ao mês desde a citação.",
    "Condeno o réu, ainda, ao pagamento das custas e honorários advocatícios, fixados em 10% do valor da condenação."
  ]
}
```

## 4. Notificação extrajudicial de aluguel

**Entrada:** [04-notificacao-aluguel.txt](04-notificacao-aluguel.txt)

```text
NOTIFICAÇÃO EXTRAJUDICIAL

Notificante: Imobiliária Lago Sul Administração de Imóveis Ltda
Notificado: Pedro Henrique Souza

Pela presente, notificamos Vossa Senhoria de que constam em aberto os aluguéis referentes aos meses de julho, agosto e setembro de 2026, no valor total de R$ 5.400,00, relativos ao imóvel situado na Avenida do Contorno, 3500, apartamento 402.

Fica Vossa Senhoria notificado a quitar o débito no prazo improrrogável de 15 dias contados do recebimento desta, acrescido de multa de 10% e juros de 1% ao mês.

O não pagamento no prazo indicado acarretará o ajuizamento de ação de despejo cumulada com cobrança, sem prejuízo de indenização por eventuais danos ao imóvel.

Belo Horizonte, 1 de outubro de 2026.
```

**Contagem de termos por tipo:**

| Tipo | Contagem | Termos encontrados |
|---|---|---|
| `contrato` | 0 | - |
| `peticao` | 0 | - |
| `decisao` | 0 | - |
| `notificacao` | 4 | notificação extrajudicial, notificante, notificado, notificamos |

**Saída esperada:** [04-notificacao-aluguel.esperado.json](04-notificacao-aluguel.esperado.json)

```json
{
  "tipo": "notificacao",
  "resumo": "NOTIFICAÇÃO EXTRAJUDICIAL Notificante: Imobiliária Lago Sul Administração de Imóveis Ltda",
  "pontos_de_atencao": [
    "Fica Vossa Senhoria notificado a quitar o débito no prazo improrrogável de 15 dias contados do recebimento desta, acrescido de multa de 10% e juros de 1% ao mês.",
    "O não pagamento no prazo indicado acarretará o ajuizamento de ação de despejo cumulada com cobrança, sem prejuízo de indenização por eventuais danos ao imóvel."
  ]
}
```

## 5. Procuração

**Entrada:** [05-procuracao.txt](05-procuracao.txt)

```text
PROCURAÇÃO AD JUDICIA

Outorgante: Luciana Batista Moreira, brasileira, professora, residente na Rua Pium-í, 845, Belo Horizonte.

Outorgado: Gustavo Ramos Teixeira, advogado inscrito na OAB/MG sob o número 123456.

Poderes: pelo presente mandato, a outorgante confere ao outorgado amplos poderes para o foro em geral, podendo propor ações, apresentar defesas, recorrer, transigir, firmar acordos e receber valores, em especial para atuar na ação de inventário dos bens deixados por seu pai.

Belo Horizonte, 3 de outubro de 2026.
```

**Contagem de termos por tipo:**

| Tipo | Contagem | Termos encontrados |
|---|---|---|
| `contrato` | 0 | - |
| `peticao` | 0 | - |
| `decisao` | 0 | - |
| `notificacao` | 0 | - |

**Saída esperada:** [05-procuracao.esperado.json](05-procuracao.esperado.json)

```json
{
  "tipo": "outro",
  "resumo": "PROCURAÇÃO AD JUDICIA Outorgante: Luciana Batista Moreira, brasileira, professora, residente na Rua Pium-í, 845, Belo Horizonte.",
  "pontos_de_atencao": []
}
```

## 6. Casos de borda

**Entrada:** [06-casos-de-borda.txt](06-casos-de-borda.txt)

Este arquivo contém caracteres que não aparecem num editor comum. Abaixo, cada linha física do arquivo é mostrada como uma string JavaScript, com os caracteres especiais escapados (incluindo o fim de linha):

```text
 1  "Mensagem do cliente 📱📄 recebida pelo WhatsApp em 2 de outubro de 2026, com transcric\u0327a\u0303o sem correções.\r\n"
 2  "Doutor, saiu a sentença e no final o juiz escreveu julgo procedente, mas eu não entendi nada do que está escrito ali e quero saber se ainda dá tempo de fazer alguma coisa antes que acabe o prazo de recurso que o senhor comentou.\r\n"
 3  "\r\n"
 4  "O advogado da outra parte fez um requerimento e requer agora a penhora do meu carro.\r\n"
 5  "Na petição está escrito que o requerimento dela requer a penhora e o bloqueio da conta.\r\n"
 6  "A requerente ainda pediu multa por atraso.\r\n"
 7  "O síndico já foi multado e a multa dele dobrou no mês seguinte.\r\n"
 8  "   \r\n"
 9  "Meu vizinho já foi multado pelo condomínio e não deu em nada\r"
10  "Tenho medo dos juros.\u00a0Eles\tdisseram que vão cobrar tudo.\r\n"
11  "Quanto vai ficar a multa?\r\n"
12  "Quanto vai ficar a multa?\r\n"
13  "QUANTO VAI FICAR A MULTA?\r\n"
```

O que cada parte testa:

| Onde | O que testa | Regra |
|---|---|---|
| Fins de linha `\r\n` e o `\r` sozinho na linha 9 | Toda quebra de linha vira `\n`. Sem isso, as linhas 9 e 10 viram uma frase só | 0 |
| `transcric\u0327a\u0303o` na linha 1 | A palavra está em NFD (letra + acento separados). Sem converter para NFC, a saída fica diferente byte a byte e a contagem de caracteres muda | 0 |
| Emojis 📱📄 na linha 1 | Cada emoji é 1 caractere (code point), mas `.length` conta 2 | 0 e 4 |
| `\u00a0` (espaço não separável) e `\t` (tab) na linha 10 | Os dois são espaços: dividem a frase depois de "juros." e viram um espaço comum | 0 e 2 |
| Linhas 3 e 8 | Linhas vazias ou só com espaços são descartadas | 2 |
| "requerimento" e "requerente" | Não casam com o termo `requer` | 1 |
| "multado" nas linhas 7 e 9 | Não casa com `multa`. Na linha 7, a segunda ocorrência ("a multa") casa, então a frase entra | 1 e 5 |
| Termos `sentença`, `julgo`, `requer` (2 vezes) e `requerente` | Contam termos diferentes, não ocorrências: 2 a 2, empate, e `decisao` vence pela prioridade | 3 |
| Resumo | As duas primeiras frases passam de 300 caracteres. O 297º caractere é um espaço, que é removido antes do `...` | 4 |
| "Quanto vai ficar a multa?" repetida | A frase idêntica entra uma vez só. A versão em maiúsculas é outra frase e também entra | 5 |

**Contagem de termos por tipo:**

| Tipo | Contagem | Termos encontrados |
|---|---|---|
| `contrato` | 0 | - |
| `peticao` | 2 | requerente, requer |
| `decisao` | 2 | sentença, julgo |
| `notificacao` | 0 | - |

**Saída esperada:** [06-casos-de-borda.esperado.json](06-casos-de-borda.esperado.json)

```json
{
  "tipo": "decisao",
  "resumo": "Mensagem do cliente 📱📄 recebida pelo WhatsApp em 2 de outubro de 2026, com transcrição sem correções. Doutor, saiu a sentença e no final o juiz escreveu julgo procedente, mas eu não entendi nada do que está escrito ali e quero saber se ainda dá tempo de fazer alguma coisa antes que acabe o prazo...",
  "pontos_de_atencao": [
    "Doutor, saiu a sentença e no final o juiz escreveu julgo procedente, mas eu não entendi nada do que está escrito ali e quero saber se ainda dá tempo de fazer alguma coisa antes que acabe o prazo de recurso que o senhor comentou.",
    "A requerente ainda pediu multa por atraso.",
    "O síndico já foi multado e a multa dele dobrou no mês seguinte.",
    "Tenho medo dos juros.",
    "Quanto vai ficar a multa?",
    "QUANTO VAI FICAR A MULTA?"
  ]
}
```
