const SUPABASE_URL = "https://ybappbdhcchtqwadavxf.supabase.co";
const SUPABASE_KEY = "sb_publishable_1zkkGqyF9PA_xjLAjSeebg_Gl5jBSYy";

// Renomeado para evitar conflito
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== AUTH =====
async function cadastrarUsuario() {
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
  });

  const msg = document.getElementById("msgAuth");

  if (error) {
    msg.innerText = "Erro no cadastro: " + error.message;
  } else {
    msg.innerText = "Cadastro realizado com sucesso!";
  }
}

async function login() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  const msg = document.getElementById("msgAuth");

  if (error) {
    msg.innerText = "Erro no login: " + error.message;
  } else {
    msg.innerText = "Login realizado com sucesso!";
    listarPessoas();
  }
}

// ===== CRUD =====
async function inserirPessoa() {
  const nome = document.getElementById("nome").value;

  const { data, error } = await supabaseClient
    .from("pessoas")
    .insert([{ nome: nome }]);

  if (error) {
    alert("Erro ao inserir: " + error.message);
  } else {
    listarPessoas();
  }
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
      li.innerHTML = `${p.nome} <button onclick="excluirPessoa(${p.id})">Excluir</button>`;
      lista.appendChild(li);
    });
  }
}

async function excluirPessoa(id) {
  const { error } = await supabaseClient.from("pessoas").delete().eq("id", id);

  if (error) {
    alert("Erro ao excluir: " + error.message);
  } else {
    listarPessoas();
  }
}

// Garante que o HTML veja as funções
window.login = login;
window.cadastrarUsuario = cadastrarUsuario;
window.inserirPessoa = inserirPessoa;
window.listarPessoas = listarPessoas;
window.excluirPessoa = excluirPessoa;
