<template>
  <BoxContainer>
    <SubTitle 
      :title="title" :desc="desc"
    ></SubTitle>

    <v-row no-gutters class="justify-center">
      <v-col no-gutters
          style="
            width: 308px; min-width: 308px; max-width: 308px; 
            height: 420px; min-height: 412px; max-height: 420px; 
          "
        >

          <div ref="captureRef"  class="hidden-capture-area">
            <ImageFrame 
              :loading="loading" 
              @image-ready="startCaptureProcess"
            ></ImageFrame>
          </div>

          <v-img
            :src="capturedImage"
            cover
          ></v-img>

      </v-col>
    </v-row>

    <v-row no-gutters justify="center | mt-3 | mb-8">
      <v-chip
        prepend-icon="mdi-arrow-up"
        append-icon="mdi-arrow-up"
        variant="text"
        color="#FF794C"
        class="chip-text"
      >
        꾹 눌러 저장하기
      </v-chip>
    </v-row>

    <v-row no-gutters justify="center" class="margin-48 | pl-14 | pr-14">
      <v-btn 
        @click="downloadImage(capturedImage)"
        color="#FFFFFF" rounded="xl" width="100%"
        class="w-text-btn"
      >
        이미지 다운로드
      </v-btn>
    </v-row>
    <v-row no-gutters justify="center" class="margin-48 | pl-14 | pr-14 | pt-2">
      <v-btn 
        @click="handleClickRestartBtn"
        color="#FF794C" rounded="xl" width="100%"
        class="text-btn"
      >
        처음부터 다시하기
      </v-btn>
    </v-row>

    <v-row no-gutters>    
        <v-col
          cols="12"
          no-gutters justify="start" 
          class="text-subtitle | mb-1 | margin-top-96"
        >
          당신의 무디멀 유형은
        </v-col>
        <v-col
          cols="12"
          no-gutters justify="start" 
          class="text-title | mb-6"
        >
         {{ result.Content_title }}
        </v-col>
        <v-col
          cols="12"
          no-gutters justify="start" 
          class="text-subtitle | mb-5"
          v-html="result.Content_lore"
        >
        </v-col>
    </v-row>

    <v-row no-gutters justify="center" class="margin-48 | mb-8 | pl-14 | pr-14">
      <v-btn 
        @click="handleClickCopyBtn"
        color="#FFFFFF" rounded="xl" width="100%" 
        class="w-text-btn"
      >
        <img src="@/assets/logo.svg" alt="Roommate Search" style="height: 26px; width: 64px; margin-right: 4px;">
        알리기
      </v-btn>  
    </v-row>
    <v-row no-gutters justify="center" class="mb-12 | pl-5 | pr-5">
      <v-col cols="auto">
        <v-btn variant="text" density="compact" href="https://github.com/Ebee1205/DungDong?tab=readme-ov-file#-%EC%9E%91%EC%97%85%EA%B8%B0" target="_blank" class="link-label | mr-3">
          둥동 작업기
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="text" density="compact" href="https://github.com/Ebee1205/DungDong?tab=readme-ov-file#-%ED%95%A8%EA%BB%98%ED%95%9C-%EC%82%AC%EB%9E%8C%EB%93%A4" target="_blank" class="link-label">
          제작자 소개
        </v-btn>
      </v-col>
    </v-row>
  </BoxContainer>

  <v-dialog v-model="dialog.dialogActive" width="auto">
    </v-dialog>


  <v-snackbar
    v-model="showToast"
    :timeout="3000"
    color="white"
    rounded="pill"
    class="mb-12"
    @update:model-value="handleSnackbarClose"
  >
    </v-snackbar>

</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, onBeforeMount, ref, nextTick} from "vue";
import axios from "axios";
import html2canvas from "html2canvas";
import Util from "@/common/Util.js"
import BoxContainer from "@/components/BoxContainer.vue";
import ImageFrame from "@/components/ImageFrame.vue";

const emit = defineEmits(['restart-analyze']);
const title = '짜잔! 결과 이미지가 나왔어요.'
const desc = '당신의 SNS 무디멀 유형은?<br>이미지를 저장하고 공유하세요.'
const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});
const loading = ref(true); 
const captureRef = ref(null); 
const capturedImage = ref(''); 
const toastMessage = ref("");
const showToast = ref(false); 
const result = ref({
  Moodimal_type: "",
  Content_title: "",
  Content_lore: ""
});

// ----- 라이프 사이클 ----- //
onBeforeMount(() => {
});


onMounted(async () => {
  localStorage.setItem('serviceStatus', 'end');
  loadMoodimalData();
  // onMounted에서 캡처 호출 제거 (이벤트 기반으로 변경됨)
});

onUnmounted(() => {
})

// ----- 함수 정의 ----- //
function loadMoodimalData() {
  const moodimalResult = JSON.parse(localStorage.getItem('moodimalResult'));
  console.log('get moodimalResult', moodimalResult.value);
  if (moodimalResult && moodimalResult.result) { 
    result.value = {
      Content_title: moodimalResult.result.Content_title || "",
      Content_lore: moodimalResult.result.Content_lore || ""
    };
    console.log('get result', result.value);
  } else {
    console.warn("moodimalResult 데이터가 비어 있습니다.");
  }
}

function handleClickRestartBtn() {
  openDialog("처음부터 다시하기", "무디멀을 다시 시작합니다.<br>처음으로 가면 되돌릴 수 없어요.", () => {
        console.log("emitting restart-analyze event.");
        localStorage.setItem('serviceStatus', 'restart');
        localStorage.setItem('moodimalResult', null);
        localStorage.setItem('ocrResult', null);
        emit('restart-analyze'); 
      }
    )
}

// ----- [수정된 캡처 로직] ----- //

async function startCaptureProcess() {
  console.log("End.vue: 'image-ready' 이벤트 수신. 캡처를 시작합니다.");
  loading.value = true; 

  // v-img가 로드 이벤트를 발생시킨 후 브라우저가 페인팅할 시간을 줍니다.
  // 50ms보다 100ms가 더 안정적일 수 있습니다.
  await new Promise(resolve => setTimeout(resolve, 100)); 

  await captureAndSetImage(); // 캡처 실행
  
  // loading.value = false; // captureAndSetImage의 finally에서 처리
}

async function captureAndSetImage() {
  if (!captureRef.value) {
    console.error("캡처할 요소가 존재하지 않습니다.");
    toastMessage.value = "캡처할 요소가 없습니다.";
    showToast.value = true;
    loading.value = false; // 로딩 종료
    return;
  }
  
  const el = captureRef.value;
  
  // [수정] 캡처를 위해 일시적으로 화면에 표시 (스타일 변경)
  // 1. 기존 스타일 저장
  const originalStyle = { 
    position: el.style.position, 
    top: el.style.top, 
    left: el.style.left,
    opacity: el.style.opacity,
    zIndex: el.style.zIndex,
    pointerEvents: el.style.pointerEvents
  };
  
  // 2. 캡처를 위해 스타일 변경 (화면 최상단, 맨 위로, 보이게)
  el.style.position = 'absolute';
  el.style.top = '0px';
  el.style.left = '0px';
  el.style.opacity = '1'; 
  el.style.zIndex = '1000'; 
  el.style.pointerEvents = 'none';
  
  // 스타일이 적용되도록 nextTick 대기
  await nextTick();

  try {
    const canvas = await html2canvas(el, {
      // allowTaint: true, // [수정] data: URI에는 불필요하며 toDataURL을 막을 수 있으므로 제거
      useCORS: true, //
      scale: window.devicePixelRatio || 2, 
      logging: true,  
      width: el.offsetWidth,  
      height: el.offsetHeight,
      backgroundColor: null
    });

    const dataUrl = canvas.toDataURL("image/png");
    capturedImage.value = dataUrl; 

    console.log("캡처 완료 및 Base64 URL 생성");

  } catch (error) {
    console.error("캡처 중 오류 발생:", error.message);
    toastMessage.value = "캡처 중 오류가 발생했습니다.";
    showToast.value = true;
  } finally {
    // [수정] 캡처 후 요소를 다시 원래 스타일로 숨김
    el.style.position = originalStyle.position;
    el.style.top = originalStyle.top;
    el.style.left = originalStyle.left;
    el.style.opacity = originalStyle.opacity;
    el.style.zIndex = originalStyle.zIndex;
    el.style.pointerEvents = originalStyle.pointerEvents;
    
    loading.value = false; // 로딩 종료
  }
}
// ----- [캡처 로직 수정 끝] ----- //


async function downloadImage(dataUrl) {
  if (!dataUrl || dataUrl === 'data:,') { 
    console.error("이미지 데이터가 없습니다. (캡처 실패)");
    toastMessage.value = "다운로드할 이미지가 없습니다. (캡처 실패)";
    showToast.value = true;
    return;
  }

  try {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "moodimal-result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toastMessage.value = "이미지 다운로드가 시작되었습니다.";
    showToast.value = true;

  } catch (error) {
    console.error("이미지 다운로드 중 오류 발생:", error);
    toastMessage.value = "이미지 다운로드에 실패했습니다.";
    showToast.value = true;
  }
}


// 클립보드에 이미지 복사
async function handleClickCopyBtn() {
  const textToCopy = `[🦉둥지동지🐥]\n한 장의 이미지로 룸메이트 구하기!\nhttps://ebee1205.github.io${import.meta.env.BASE_URL}`;
  try {
    await navigator.clipboard.writeText(textToCopy);
    console.log('Text copied to clipboard');
    openDialog(
    `클립보드에 복사됨`,
    `[🦉둥지동지🐥]<br>한 장의 이미지로 룸메이트 구하기!<br>https://ebee1205.github.io${import.meta.env.BASE_URL}`,
    )
  } catch (err) {
    console.error('Failed to copy text: ', err);
    openDialog('클립보드 복사 실패', '해당 브라우저에서는 클립보드 복사를 지원하지 않습니다.');
  }
}

// 다이얼로그 유틸
function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}

// 스낵바 유틸
function handleSnackbarClose(value) {
  if (!value) {
    showToast.value = false; // 상태를 false로 리셋
    console.log("Snackbar 닫힘");
  }
}

</script>

<style scoped>
/* ... (text-btn, w-text-btn 등 다른 스타일은 동일) ... */

.text-btn {
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.w-text-btn {
  color: #000;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.5px;
}

/* [수정 없음]
   이 CSS는 캡처 로직과 연동되어
   JS가 일시적으로 이 스타일을 덮어쓰고 캡처 후 복원합니다.
*/
.hidden-capture-area {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0; /* 보이지 않게 */
  pointer-events: none; /* 클릭/마우스 이벤트 방지 */
  z-index: -1; /* 다른 요소들 뒤로 숨김 */
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

.margin-top-96 {
  margin-top: 56px;
}

.text-label-container {
  margin-top: 56px;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
}

.text-label {
  color: #B1B1B1;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.3px;
}

.link-label {
  text-decoration: underline;
  font-size: 15x;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.4px;
  color: #404040;
  cursor: pointer;
}

.chip-text {
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
}
</style>