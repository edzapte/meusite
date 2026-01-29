import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ybappbdhcchtqwadavxf.supabase.co";
const SUPABASE_KEY = "sb_publishable_1zkkGqyF9PA_xjLAjSeebg_Gl5jBSYy";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("form");
const lista = document.getElementById("lista");

async function carregar() {
  const { data, error } = await supabase
    .from("pessoas")
    .select("*");

  if (error) {
    console.error("Erro ao carregar:", error);
    return;
  }

  lista.innerHTML = "";
  data.forEach(p => {
    lista.innerHTML += `<li>${p.nome} - ${p.email}</li>`;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  const { error } = await supabase
    .from("pessoas")
    .insert([{ nome, email }]);

  if (error) {
    alert("Erro ao salvar");
    console.error(error);
    return;
  }

  form.reset();
  carregar();
});

carregar();
