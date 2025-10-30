<template>
  <v-container class="card-container">
    <v-row no-gutters class="img-container | elevation-1">
      <v-img
        :src="result.Moodimal_image"
        cover
        style="width: 100%; height: 100%; border-radius: 12px;"

        @load="onImageLoad"
        @error="onImageError"
      >
      </v-img>
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
import { onMounted, ref, nextTick } from "vue";

// [수정 2] 부모에게 이벤트를 보내기 위해 defineEmits 선언
const emit = defineEmits(['image-ready']);

const props = defineProps({
  loading: Boolean,
});

const result = ref({
  Moodimal_image: null,
  Card_title: "",
  Card_lore: "",
});

// [수정 3] 이미지 로드/에러 핸들러 함수 정의
function onImageLoad() {
  console.log('ImageFrame: 이미지 로드 성공. 캡처 준비 완료 이벤트 emit');
  emit('image-ready');
}

function onImageError() {
  console.error('ImageFrame: 이미지 로드 실패. 캡처 이벤트 anyway emit');
  // 실패하더라도 (회색 박스라도) 캡처는 진행하도록 emit 호출
  emit('image-ready');
}


onMounted(() => {
  try {
    const moodimalResult = JSON.parse(localStorage.getItem("moodimalResult"));
    const moodimalImage = localStorage.getItem("moodimalImage"); // JSON.parse ❌

    console.log("get moodimalResult", moodimalResult);

    let imageSrc = null;
    if (moodimalImage) {
      // Base64 접두사 확인 및 추가
      imageSrc = moodimalImage.startsWith('data:image') 
        ? moodimalImage 
        : `data:image/png;base64,${moodimalImage}`;
    }

    if (moodimalResult && moodimalResult.result) {
      result.value = {
        Moodimal_image: imageSrc,
        Moodimal_type: moodimalResult.moodimal || "",
        Card_title: moodimalResult.result.Card_title || "",
        Card_lore: moodimalResult.result.Card_lore || "",
      };
      console.log("component get result", result.value);
    } else {
      console.warn("moodimalResult 데이터가 비어 있습니다.");
      // 결과 데이터가 없더라도 이미지는 표시 시도
      result.value.Moodimal_image = imageSrc;
    }

    // [수정 4] 만약 로드할 이미지가 아예 없는 경우(imageSrc가 null)
    // v-img의 @load나 @error가 발생하지 않으므로, 강제로 이벤트를 emit합니다.
    if (!imageSrc) {
      nextTick(() => {
        console.warn("ImageFrame: 로드할 이미지가 없습니다. 강제 emit");
        emit('image-ready');
      });
    }

  } catch (error) {
    console.error("ImageFrame 데이터 로드 중 오류:", error);
    // [수정 5] 오류 발생 시에도 캡처 프로세스는 진행되도록 강제 emit
    nextTick(() => {
      console.error("ImageFrame: 데이터 로드 중 오류 발생. 강제 emit");
      emit('image-ready');
    });
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