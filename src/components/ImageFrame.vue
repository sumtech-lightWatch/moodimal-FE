<template>
  <v-container class="card-container">
    <!-- 이미지 영역 -->
    <v-row no-gutters class="img-container | elevation-1">
      <!-- Moodimal_image가 있을 경우 -->
      <v-img
        v-if="result.Moodimal_image"
        :src="result.Moodimal_image"
        cover
        style="width: 100%; height: 100%; border-radius: 12px;"
      ></v-img>
    </v-row>

    <v-row
      no-gutters
      class="justify-center | align-center | text-center | mt-6"
    >
      <v-col cols="12" class="card-title">
        {{ result.Card_title }}
      </v-col>
      <v-col cols="12" class="card-desc | mt-3">
        {{ result.Card_lore }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  loading: Boolean,
});

const result = ref({
  Moodimal_image: null,
  Card_title: "",
  Card_lore: "",
});

onMounted(() => {
  try {
    const moodimalResult = JSON.parse(localStorage.getItem("moodimalResult"));
    const moodimalImage = localStorage.getItem("moodimalImage"); // JSON.parse ❌

    console.log("get moodimalResult", moodimalResult);

    if (moodimalResult && moodimalResult.result) {
      result.value = {
        Moodimal_image: moodimalImage || "",
        Moodimal_type: moodimalResult.moodimal || "",
        Card_title: moodimalResult.result.Card_title || "",
        Card_lore: moodimalResult.result.Card_lore || "",
      };
      console.log("component get result", result.value);
    } else {
      console.warn("moodimalResult 데이터가 비어 있습니다.");
    }
  } catch (error) {
    console.error("ImageFrame 데이터 로드 중 오류:", error);
  }
});

</script>

<style scoped>
.card-container {
    width: 308px; min-width: 308px; max-width: 308px; 
    height: 420px; min-height: 412px; max-height: 420px; 
    padding: 36px;
    background-color: #FFFFFF;
    border-radius: 24px; border-color: #CCCCCC; border-width: 1px; border-style: solid;
    justify-content: center; justify-items: center;
}

.img-container {
    width: 236px; min-width: 236px; max-width: 236px; 
    height: 236px; min-height: 236px; max-height: 236px;
    border-radius: 16px; 
    background-color: #F2F2F2;
    justify-content: center; justify-items: center;
}

.card-title {
    font-family: "Bagel Fat One", system-ui;
    font-size: 24px;
    font-weight: 400;
    font-style: normal;
}

.card-desc {
    font-size: 15px;
    font-weight: 300;
    letter-spacing: -3%;
}

</style>


