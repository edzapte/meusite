import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔹 Dados do seu projeto
const SUPABASE_URL = "https://ybappbdhcchtqwadavxf.supabase.co";
const SUPABASE_KEY = "sb_publishable_1zkkGqyF9PA_xjLAjSeebg_Gl5jBSYy";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔐 Auth elements
const emailLogin = document.getElementById("emailLogin");
const senhaLogin = document.getElementById("senhaLogin");
const btnLogin = document.getElementById("btnLogin");
const btnCadastro = document.getElementById("btnCadastro");
const btnLogout = document.getElementById("btnLogout");

// 📋 CRUD elements
const form = document.getElementById("form");
const lista = document.getElementById("lista");
const inputId = document.getElementById("id");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const btnCancelar = document.getElementById("btnCancelar");

// 🔐 Auth functions
async function login() {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha
  });

  const msg = document.getElementById("msgAuth");

  if (error) {
    msg.innerText = "Erro no login: " + error.message;
  } else {
    msg.innerText = "Login realizado com sucesso!";
  }
}

async function cadastrarUsuario() {
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: senha
  });

  const msg = document.getElementById("msgAuth");

  if (error) {
    msg.innerText = "Erro no cadastro: " + error.message;
  } else {
    msg.innerText = "Cadastro realizado! Verifique seu e-mail (se exigido).";
  }
}


async function logout() {
  await supabase.auth.signOut();
  atualizarEstadoAuth();
}

btnLogin.onclick = login;
btnCadastro.onclick = cadastrarUsuario;
btnLogout.onclick = logout;

// 📋 CRUD functions
async function carregar() {
  const { data, error } = await supabase
    .from("pessoas")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao carregar:", error);
    return;
  }

  lista.innerHTML = "";
  data.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.nome} - ${p.email}
      <button data-id="${p.id}" class="editar">Editar</button>
      <button data-id="${p.id}" class="excluir">Excluir</button>
    `;
    lista.appendChild(li);
  });

  document.querySelectorAll(".editar").forEach(btn => {
    btn.onclick = () => editar(btn.dataset.id);
  });

  document.querySelectorAll(".excluir").forEach(btn => {
    btn.onclick = () => excluir(btn.dataset.id);
  });
}

async function salvarOuAtualizar() {
  const nome = inputNome.value;
  const email = inputEmail.value;
  const id = inputId.value;

  if (id) {
    // UPDATE
    const { error } = await supabase
      .from("pessoas")
      .update({ nome, email })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar");
      console.error(error);
      return;
    }
  } else {
    // INSERT
    const { error } = await supabase
      .from("pessoas")
      .insert([{ nome, email }]);

    if (error) {
      alert("Erro ao salvar");
      console.error(error);
      return;
    }
  }

  form.reset();
  inputId.value = "";
  btnCancelar.style.display = "none";
  carregar();
}

async function editar(id) {
  const { data, error } = await supabase
    .from("pessoas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert("Erro ao carregar registro");
    console.error(error);
    return;
  }

  inputId.value = data.id;
  inputNome.value = data.nome;
  inputEmail.value = data.email;
  btnCancelar.style.display = "inline";
}

async function excluir(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  const { error } = await supabase
    .from("pessoas")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao excluir");
    console.error(error);
    return;
  }

  carregar();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  salvarOuAtualizar();
});

btnCancelar.addEventListener("click", () => {
  form.reset();
  inputId.value = "";
  btnCancelar.style.display = "none";
});

// 🔁 Estado da autenticação
async function atualizarEstadoAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    btnLogout.style.display = "inline";
    btnLogin.style.display = "none";
    btnCadastro.style.display = "none";
    carregar();
  } else {
    btnLogout.style.display = "none";
    btnLogin.style.display = "inline";
    btnCadastro.style.display = "inline";
    lista.innerHTML = "";
  }
}

atualizarEstadoAuth();
