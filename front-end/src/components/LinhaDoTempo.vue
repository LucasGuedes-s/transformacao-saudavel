<template>
  <div class="container py-4">
    <h4 class="text-center mb-4 fw-bold">📈 Histórico de Peso</h4>

    <!-- 🟢 Formulário de novo registro -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h5 class="card-title mb-3">Adicionar novo registro</h5>

        <form @submit.prevent="adicionarRegistro">
          <div class="row g-2 align-items-end">
            <div class="col-md-4">
              <label class="form-label">Peso (kg)</label>
              <input
                v-model="novoPeso"
                type="number"
                step="0.1"
                min="0"
                class="form-control"
                placeholder="Ex: 72.5"
                required
              />
            </div>

            <div class="col-md-6">
              <label class="form-label">Comentário</label>
              <input
                v-model="novoComentario"
                type="text"
                class="form-control"
                placeholder="Ex: Atingi minha meta semanal!"
              />
            </div>

            <div class="col-md-2 text-center">
              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="carregando"
              >
                <span v-if="carregando" class="spinner-border spinner-border-sm"></span>
                <span v-else>Salvar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- 📜 Timeline -->
    <div v-if="historico.length" class="timeline">
      <div
        v-for="(item, index) in historicoOrdenado"
        :key="index"
        class="timeline-item"
      >
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h6 class="mb-1 fw-semibold">
            {{ formatarData(item.data) }}
          </h6>
          <p class="mb-0">
            <strong>Peso:</strong> {{ item.peso }} kg
          </p>
          <p v-if="item.comentario" class="text-muted fst-italic mt-1">
            "{{ item.comentario }}"
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted">
      Nenhum histórico registrado ainda.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/store";

const historico = ref([]);
const auth = useAuthStore();

// Campos do novo registro
const novoPeso = ref("");
const novoComentario = ref("");
const carregando = ref(false);

const historicoOrdenado = computed(() =>
  [...historico.value].sort((a, b) => new Date(b.data) - new Date(a.data))
);

async function carregarHistorico() {
  try {
    const usuario = auth.usuario;
    const { data } = await axios.get(
      `https://transformacao-saudavel.onrender.com/user/${usuario.id}/historico`
    );
    historico.value = combinarHistorico(data.historicoPeso, data.comentarios);
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
  }
}

async function adicionarRegistro() {
  if (!novoPeso.value) return;

  try {
    carregando.value = true;
    const usuario = auth.usuario;

    await axios.post(
      `https://transformacao-saudavel.onrender.com/user/${usuario.id}/historico`,
      {
        peso: parseFloat(novoPeso.value),
        comentario: novoComentario.value,
      }
    );

    // Atualiza a timeline após o post
    await carregarHistorico();

    // Limpa os campos
    novoPeso.value = "";
    novoComentario.value = "";
  } catch (err) {
    console.error("Erro ao adicionar registro:", err);
  } finally {
    carregando.value = false;
  }
}

function combinarHistorico(pesos, comentarios) {
  return pesos.map((p, i) => ({
    peso: p.peso,
    data: p.data,
    comentario: comentarios[i]?.texto || null,
  }));
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

onMounted(() => carregarHistorico());
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 40px;
  border-left: 3px solid #0d6efd;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-marker {
  position: absolute;
  left: -10px;
  top: 4px;
  width: 16px;
  height: 16px;
  background-color: #0d6efd;
  border-radius: 50%;
  box-shadow: 0 0 0 3px white;
}

.timeline-content {
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 576px) {
  .timeline {
    padding-left: 25px;
  }
  .timeline-marker {
    left: -8px;
  }
}
</style>
