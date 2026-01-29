import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ybappbdhcchtqwadavxf.supabase.co";
const SUPABASE_KEY = "SUA_ANON_PUBLIC_KEY_AQUI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const inputId = document.getElementById("id");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const btnCancelar = document.getElementById("btnCancelar");

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

carregar();
