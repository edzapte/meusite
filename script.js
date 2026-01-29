const SUPABASE_URL = "https://ybappbdhcchtqwadavxf.supabase.co";
const SUPABASE_KEY = "sb_publishable_1zkkGqyF9PA_xjLAjSeebg_Gl5jBSYy";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== AUTH =====
async function cadastrarUsuario() {
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  const { error } = await supabaseClient.auth.signUp({ email, password: senha });
  const msg = document.getElementById("msgAuth");

  msg.innerText = error ? "Erro no cadastro: " + error.message : "Cadastro realizado!";
}

async function login() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });
  const msg = document.getElementById("msgAuth");

  if (error) msg.innerText = "Erro no login: " + error.message;
  else {
    msg.innerText = "Login realizado!";
    listarPessoas();
  }
}

// ===== CRUD =====
let idEditando = null;

async function inserirPessoa() {
  const nome = document.getElementById("nome").value;

  if (idEditando) {
    // UPDATE
    const { error } = await supabaseClient
      .from("pessoas")
      .update({ nome })
      .eq("id", idEditando);

    if (error) alert("Erro ao editar: " + error.message);
    idEditando = null;
  } else {
    // INSERT
    const { error } = await supabaseClient
      .from("pessoas")
      .insert([{ nome }]);

    if (error) alert("Erro ao inserir: " + error.message);
  }

  document.getElementById("nome").value = "";
  listarPessoas();
}

async function listarPessoas() {
  const { data, error } = await supabaseClient.from("pessoas").select("*");

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  if (error) {
    alert("Erro ao listar: " + error.message);
  } else {
    data.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${p.nome}
        <button onclick="editarPessoa(${p.id}, '${p.nome}')">Editar</button>
        <button onclick="excluirPessoa(${p.id})">Excluir</button>
      `;
      lista.appendChild(li);
    });
  }
}

function editarPessoa(id, nome) {
  document.getElementById("nome").value = nome;
  idEditando = id;
}

async function excluirPessoa(id) {
  const { error } = await supabaseClient.from("pessoas").delete().eq("id", id);

  if (error) alert("Erro ao excluir: " + error.message);
  else listarPessoas();
}

// Expor funções
window.login = login;
window.cadastrarUsuario = cadastrarUsuario;
window.inserirPessoa = inserirPessoa;
window.listarPessoas = listarPessoas;
window.excluirPessoa = excluirPessoa;
window.editarPessoa = editarPessoa;
