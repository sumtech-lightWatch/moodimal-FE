<template>
  <BoxContainer>

    <SubTitle :title="title" :desc="desc"> </SubTitle>

    <v-row no-gutters justify="start">
      <v-label>기숙사를 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858" 
        :items="dormItem"
        placeholder="기숙사"
        v-model="dorm" 
      ></v-select>
    </v-row>

    <v-row no-gutters justify="start">
      <v-label>단과대를 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858"
        :items="collegeItem"
        v-model="college"
      ></v-select>
    </v-row>
    
    <v-row no-gutters justify="start">
      <v-label>학번을 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858"
        :items="studentIdItem"
        v-model="studentId"
      ></v-select>
    </v-row>

    <v-row no-gutters justify="start">
      <v-label>생년을 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858"
        :items="birthItem"
        v-model="birth"
      ></v-select>
    </v-row>
  </BoxContainer>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import BoxContainer from "@/components/BoxContainer.vue";
import SubTitle from "@/components/SubTitle.vue";

const title = '기본정보'
const desc = '먼저, 가장 기본적인 것부터 작성해볼까요?<br>나에 대한 정보를 입력해주세요.'

const dorm = ref(null);          // 기숙사
const birth = ref(0);      // 생년월일 8자리 (문자열 권장)
const studentId = ref(0);     // 학번 8자리 (문자열 권장)
const college = ref('비공개');     // 단과대 숫자

const dormItem = ref([
  { title: '예지 1동', value: '예지 1동'},
  { title: '예지 2동', value: '예지 2동'},
  { title: '예지 3동', value: '예지 3동'},
  { title: '명덕 1동', value: '명덕 1동'},
  { title: '명덕 2동', value: '명덕 2동'},
  { title: '명덕 3동', value: '명덕 3동'},
  // { title: '글로벌 하우스', value: 20},
  // { title: '308 블루미르홀', value: 21},
  // { title: '309 블루미르홀', value: 22},
  // { title: '퓨처하우스', value: 23}
])

const birthItem = ref(
  [
    { title: "비공개", value: 0 }, 
    ...Array.from({ length: 15 }, (_, index) => {
      const year = 2010 - index;
      return { title: `${year}년`, value: year };
    }),
  ]
);

const studentIdItem = ref(
  [
    { title: "비공개", value: 0 }, 
    ...Array.from({ length: 10 }, (_, index) => {
      const year = 25 - index;
      return { title: `${year}학번`, value: year };
    }),
  ]
);

const collegeItem = ref([
  { title: '비공개', value: 0},
  { title: '예술대학', value: 1},
  { title: '체육대학', value: 2},
  { title: '예술공학대학', value: 3},
  { title: '생명공학대학', value: 4},
  { title: '공과대학', value: 5},
])

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {

})

// 변경값 확인 및 업데이트
watch(dorm, (newValue, oldValue) => {
  console.log(`--- Dorm changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("dorm", newValue);
});

watch(birth, (newValue, oldValue) => {
  console.log(`--- Birth year changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("birth", newValue);
});

watch(studentId, (newValue, oldValue) => {
  console.log(`--- Student ID changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("studentId", newValue);
});

watch(college, (newValue, oldValue) => {
  console.log(`--- College changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("college", newValue);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 1}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    dorm.value = survey.dorm || '예지 1동';
    birth.value = survey.birth || 0;
    studentId.value = survey.studentId || 0;
    college.value = survey.college || '비공개';
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

</script>

<style scoped>
/* 토글 버튼 아이콘 색상 */
:deep(.v-input__control .v-icon) {
  color: #FF5858 !important; /* 아이콘 색상 */
}

:deep(.v-label) {
  color: #000000;
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
</style>