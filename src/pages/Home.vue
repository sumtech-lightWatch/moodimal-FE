<template>
  <v-container>
    <v-row no-gutters justify="center" class="margin-88 | margin-top-100">
      <v-img 
      src="@/assets/logo.svg"
      :width="240" :height="80"
      min-width="240px" min-height="80px" 
      ></v-img>
    </v-row>
    <v-row no-gutters justify="center" class="margin-88px | mt-2">
      <v-col class="title-text-sub">
        한 장의 이미지로 룸메이트 구하기!
      </v-col>
    </v-row>


    <!-- <v-row no-gutters justify="start">
      <v-label>단과대를 선택해주세요</v-label>
    </v-row> -->
    <v-row no-gutters justify="center" class="mt-1">
      <v-file-input
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF794C" color="#FF794C" item-color="#FF794C"
        label="SNS 캡처 화면을 업로드 해주세요"
        v-model="uploadedFile"
        prepend-icon=""
        append-inner-icon="mdi-camera"
        accept="image/*"
      ></v-file-input>
    </v-row>
    
    <v-row 
      no-gutters justify="center" class="margin-42 | mt-2"
    >
      <v-btn 
        @click="handleClickStartBtn"
        variant="flat" color="#FF794C" rounded="xl" size="large" width="80%" height="32px"
        class="text-small-btn"
      >
        결과확인하기
      </v-btn>
    </v-row>
  </v-container>

  <!-- 다이얼로그 -->
  <v-dialog v-model="dialog.dialogActive" width="auto">
    <v-card class="pa-2 | pb-3" rounded="lg">
      <v-card-title class="text-title | pl-4 | pr-4 | pt-4">
        <v-row style="justify-content: start; align-items: center;">
          <v-col class="pt-0 | pb-0 | pl-4 | pr-1" cols="auto">
            <v-img
              src="@/assets/logo.png"
              height="24"
              width="24"
              class=""
            ></v-img>
          </v-col>
          <v-col class="pl-1" cols="auto">
            {{ dialog.title }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="text-subtitle | pl-4 | pr-4 | pt-2 | pb-3" v-html="dialog.text"></v-card-text>
      <template v-slot:actions>
          <v-row no-gutters justify="end">
              <!-- <v-btn color="#FF5858" width="25%" rounded="xl" variant="outlined" @click="dialog.dialogActive = false">취소</v-btn> -->
              <v-btn color="#FF5858" width="25%" rounded="xl" variant="flat" class="ml-2" @click="dialog.okButton">확인</v-btn>
          </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>


<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 'start-loading' 이벤트를 쓰지 않는 방식(라우터로 이동)으로 정리
const emit = defineEmits(['hide-appbar', 'start-survey', 'restart-survey']);


const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

const uploadedFile = ref(null);   
const uploading = ref(false);     

onMounted(() => {
  emit('hide-appbar');
  setCurrentSurvey();
});

// ----- 함수 정의 ----- //

function setCurrentSurvey() {
  const existing = localStorage.getItem('userSurvey');
  if (existing) {
    const survey = JSON.parse(existing);
    // 필요 시 사용
  }
}

function updateLocalStorage(field, value) {
  const existing = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existing[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existing));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}


async function handleClickStartBtn() {
  const file = Array.isArray(uploadedFile.value)
    ? uploadedFile.value?.[0]
    : uploadedFile.value;

  if (!file) {
    openDialog(
      '이미지를 업로드해 주세요',
      'SNS 캡처 이미지를 선택한 뒤 <b>결과확인하기</b>를 눌러주세요.',
      () => { dialog.value.dialogActive = false; }
    );
    return;
  }

  if (uploading.value) return;
  uploading.value = true;

  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateLocalStorage('uploadedImage', e.target.result);
    };
    reader.readAsDataURL(file);

    updateLocalStorage('serviceStatus', 'uploading');
    localStorage.setItem('appInitialized', 'false');
    router.push({ name: 'Load' });

    const tid = Date.now();
    await generateOcrText(file, tid);

  } catch (error) {
    console.error('파일 처리 실패:', error);
    updateLocalStorage('serviceStatus', 'failed');
    updateLocalStorage('apiError', error?.message ?? String(error));
  } finally {
    uploading.value = false;
  }
}

async function generateOcrText(file, tid) {
  try {
    const formData = new FormData();
    formData.append('tid', String(tid));
    formData.append('file', file);

    const url = '/api/v1/generate/ocr/text';

    const res = await fetch(url, { method: 'POST', body: formData });
    const result = await res.json();

    updateLocalStorage('ocrResult', JSON.stringify(result));
    updateLocalStorage('serviceStatus', 'completed');
  } catch (error) {
    console.error('API 호출 실패:', error);
    updateLocalStorage('serviceStatus', 'failed');
    updateLocalStorage('apiError', error?.message ?? String(error));
  }
}


// 다이얼로그 유틸
function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}


</script>


<style scoped>

/* 토글 버튼 아이콘 색상 */
:deep(.v-input__control .v-icon) {
  color: #FF794C !important; /* 아이콘 색상 */
}

:deep(.v-label) {
  color: #1B1818;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.padding-0 {
  padding: 0px;
}

.margin-top-52 {
  margin-top: 52px;
}

.margin-top-100 {
  margin-top: 100px;
}

.margin-42 {
  margin-left: 42px;
  margin-right: 42px;
}

.margin-top-56 {
  margin-top: 56px;
}

.margin-88 {
  margin-left: 88px;
  margin-right: 88px;
}

.title-text-sub {
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.5px;
}

.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.text-small-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.4px;
}

.text-btn:hover {
  transform: scale(1.05);
}

.card-title-text {
  padding-left: 8px;
  color: #1B1818 !important; /* 아이콘 색상 */
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.text-title {
    font-size: 19.5px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.5px;
}

.text-subtitle {
    font-size: 15x;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.4px;
    color: #404040;
}

</style>