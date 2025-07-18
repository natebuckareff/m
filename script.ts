let works = 0;
let doesntWork = 0;

// a * bb
function check(a: number, b: number) {
  const bs = b.toString();
  if (bs.length !== 2) {
    return;
  }

  const [bl] = b.toString().split("")[0];
  const p = a * Number(bl);
  const ps = p.toString();

  if (ps.length !== 2) {
    return;
  }

  const [l, r] = ps.split("");
  const m = Number(l) + Number(r);

  const output = Number(`${l}${m}${r}`);
  const rendered = `${a} * ${b} = ${output}`;
  const expected = a * b;

  return { rendered, expected, output };
}

const output: string[][] = [];

for (let a = 1; a <= 9; ++a) {
  for (let b = 1; b <= 99; ++b) {
    const r = check(a, b);
    const correct = r && r.output === r.expected;
    output.push([
      `${a} x ${b}`,
      r?.output?.toString() ?? "??",
      r?.expected?.toString() ?? "??",
      correct ? "✅" : "❌",
    ]);
  }
}

function makeRadioButtons(total: number, correct: number, wrong: number) {
  return `
    <div style="margin-bottom: 1em;">
      <div>
        <label><input type="radio" name="filter" value="all" checked> Show all (${total})</label>
      </div>
      <div>
        <label><input type="radio" name="filter" value="correct"> Correct only (${correct})</label>
      </div>
      <div>
        <label><input type="radio" name="filter" value="wrong"> Wrong only (${wrong})</label>
      </div>
    </div>
  `;
}

function makePage(radioButtons: string, inner: string) {
  let html = "";
  html += "<html>";
  html += `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      /* Base font size bump for better mobile readability */
      body, table { font-size: 24px; }
      table {
        width: 100%;
        max-width: 800px;
      }
    </style>
    <title>table for mom's reel</title>
  </head>`;
  html += "<body>";
  html += radioButtons;
  html += inner;
  html += `
    <script>
      function filterTable() {
        const value = document.querySelector('input[name="filter"]:checked').value;
        const rows = document.querySelectorAll("table tr.data-row");
        rows.forEach(row => {
          const correct = row.getAttribute("data-correct");
          if (value === "all") {
            row.style.display = "";
          } else if (value === "correct" && correct === "✅") {
            row.style.display = "";
          } else if (value === "wrong" && correct === "❌") {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      }
      document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener("change", filterTable);
      });
      // Initial filter in case the table is rendered after DOMContentLoaded
      window.addEventListener("DOMContentLoaded", filterTable);
    </script>
  `;
  html += "</body>";
  html += "</html>";
  return html;
}

function makeHtmlTable(output: string[][]) {
  let html = '<table border="1" cellpadding="4" cellspacing="0">\n';
  // Add table headers
  html += "  <tr><th>eq</th><th>output</th><th>correct</th></tr>\n";
  for (const row of output) {
    // row[3] is "✅" for correct, "❌" for incorrect
    let bgColor = "";
    if (row[3] === "✅") {
      bgColor = ' style="background-color: #d4f7d4;"'; // light green
    } else if (row[3] === "❌") {
      bgColor = ' style="background-color: #f7d4d4;"'; // light red
    }
    html += `  <tr class="data-row" data-correct="${row[3]}"${bgColor}>`;
    // Only include the first, second, and fourth columns as per headers
    html += `<td>${row[0]}</td>`;
    html += `<td>${row[1]}</td>`;
    html += `<td>${row[3]}</td>`;
    html += "</tr>\n";
  }
  html += "</table>";
  return html;
}

const totalRows = output.length;
const correctRows = output.filter((row) => row[3] === "✅").length;
const wrongRows = totalRows - correctRows;

const radioHtml = makeRadioButtons(totalRows, correctRows, wrongRows);
const tableHtml = makeHtmlTable(output);

console.log(makePage(radioHtml, tableHtml));
