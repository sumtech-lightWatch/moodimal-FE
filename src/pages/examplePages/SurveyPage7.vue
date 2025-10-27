<template>
  <BoxContainer>
    <SubTitle :title="title" :desc="desc"> </SubTitle>

    <v-row no-gutters justify="start">
      <v-label v-html="'해당하는 것이 있다면 선택해주세요<br>(최대5개)'"></v-label>
    </v-row>
    <v-row no-gutters justify="start" class="mt-4">
      <v-col>
        <v-chip
          v-for="(tag, index) in tagItem"
          :key="index"
          :class="{'v-chip--selected': selectTag.includes(tag.value)}"
          class="custom-chip | mb-2 | mr-2 | pr-3 | pl-3"
          :style="{ backgroundColor: 'white' }"
          :color="selectTag.includes(tag.value) ? '#FF5858' : '#B1B1B1'"
          variant="outlined"
          @click="handleClickTag(tag.value)"
        >
          {{ tag.title }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row no-gutters justify="start" class="margin-top-52">
      <v-label>더 하고 싶은 말이 있다면 작성해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-text-field
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#CCCCCC" color="#CCCCCC" item-color="#CCCCCC" 
        placeholder="태그 설명 등을 작성해주세요"
        v-model="notes"
        maxlength="100"
      >
        <template v-slot:append-inner>
          <v-label class="count-label" :text="`${notes.length}/100`"></v-label>
        </template>

      </v-text-field>
    </v-row>
    
  </BoxContainer>
</template>

<script setup>

// ----- 선언부 ----- //

import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import BoxContainer from "@/components/BoxContainer.vue";

const title = '참고사항'
const desc = '앞서 작성한 것 외에 더 하고 싶은 말이 있다면<br>이 페이지에서 자유롭게 말해주세요.'

const selectTag = ref([])
const tagItem = ref([
  { title: '매트선호', value: '매트선호'},
  { title: '룸메와 거리두기 필요', value: '룸메와 거리두기 필요'},
  { title: '취준/자격증', value: '취준/자격증'},
  { title: '고요를 즐김', value: '고요를 즐김'},
  { title: '배달음식러버', value: '배달음식러버'},
  { title: '잦은 밤샘', value: '잦은 밤샘'},
  { title: '끝없는과제', value: '끝없는과제'},
  { title: '길거나 잦은 통화', value: '길거나 잦은 통화'},
  { title: '환기 자주 필요', value: '환기 자주 필요'},
  { title: '방에 자주 비움', value: '방을 자주 비움'},
  { title: '추위 많이 탐', value: '추위 많이 탐'},
  { title: '더위 많이 탐', value: '더위 많이 탐'},
  { title: '짐이 많음', value: '짐이 많음'},
  { title: '잠귀 밝음', value: '잠귀 밝음'},
])

const notes = ref('')

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {

})

// 변경값 확인 및 업데이트
watch(selectTag, (newValue, oldValue) => {
  console.log(`--- selectTag changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("selectTag", newValue);
});

watch(notes, (newValue, oldValue) => {
  console.log(`--- notes changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("notes", newValue);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 7}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    selectTag.value = survey.selectTag || [];
    notes.value = survey.notes || '';
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

function handleClickTag(value) {
  const index = selectTag.value.indexOf(value);

  // 이미 선택된 태그라면 선택을 해제
  if (index !== -1) {
    selectTag.value.splice(index, 1); // 선택 해제
  } else {
    // 태그가 5개 미만일 때만 새로운 태그 추가
    if (selectTag.value.length < 5) {
      selectTag.value.push(value); // 선택 추가
    } else {
      console.log("tag select lmit - 5");
    }
  }
  console.log("Selected tags:", selectTag.value);
  updateLocalStorage("selectTag", selectTag.value);
}


</script>

<style scoped>
.margin-top-52{
  margin-top: 52px;
}

:deep(.v-label) {
  color: #000000;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.count-label {
  color: #000000;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.4px;
}
</style>