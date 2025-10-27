<template>
    <v-container 
        style="width: 1000px; height: 1000px; min-width: 1000px; min-height: 1000px; max-width: 1000px; max-height: 1000px; padding: 30px;"
    >
        <v-row no-gutters class="justify-space-between | pb-6" style="align-items: center;">
            <v-col cols="auto" style="width: 165px; max-width: 165px; margin-left: 30px; align-self: end;">
            
            </v-col>
            <v-col cols="auto" style="margin-top: 48px;">
                <v-row no-gutters class="text-subtitle | pb-2">
                    <v-col>
                        {{ props.survey.dorm }}의
                    </v-col>
                </v-row>
                <v-row no-gutters height="100px">
                    <v-col class="text-title">
                        {{ props.survey.title }} 룸메
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider :thickness="3"></v-divider>
        <v-row no-gutters>
            <v-col 
                no-gutters 
                style="width: 538px; min-width: 538px; max-width: 538px; 
                padding-left: 28px; padding-right: 28px; padding-top: 48px; align-items: end;" 
            >
                <v-row
                    style="width: 484px; max-height: 125px; margin-bottom: 32px;"
                    class="main-info-pill"
                    no-gutters
                >
                    <v-col style="width: 111px; min-width: 111px; max-width: 111px;">
                        <v-row no-gutters class="main-info-icon | rounded-circle | pa-4">

                        </v-row>
                    </v-col>
                    <v-col class="main-info-title" style="padding-right: 21px;">
                        {{ props.survey.college }}의 {{ props.survey.studentId }}학번 <br> {{ props.survey.birth }}년생 {{ props.survey.mbti }}
                    </v-col>
                </v-row>

                <v-row no-gutters>
                    <v-col cols="auto" class="text-bodytitle">흡연여부</v-col>
                    <v-col style="padding-left: 32px;" class="text-bodytext ">{{ props.survey.smoke }}</v-col>
                </v-row>

                <v-row no-gutters class="pt-4">
                    <v-col cols="auto" class="text-bodytitle">음주빈도</v-col>
                    <v-col style="padding-left: 32px;">
                        <v-row no-gutters class="text-bodytext">{{ props.survey.drink }}</v-row>
                        <v-row no-gutters>
                            <v-label class="sd-label">{{ props.survey.sdEtc }}</v-label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters class="justify-space-between | pt-6" style="align-content: center">
                    <v-col cols="auto" class="text-bodytitle">귀가주기</v-col>
                    <v-col no-gutters cols="auto" class="pt-1">
                        <v-row no-gutters>
                            <v-col cols="auto" class="progress-bar">
                                <div
                                v-for="(step, index) in 5"
                                :key="index"
                                class="circle"
                                :class="{ active: index === props.survey.home }"
                                >
                                <div class="line" v-if="index !== 4"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="justify-space-between | pt-1" style="width: 362px;">
                            <v-label>잘 안들어옴</v-label>
                            <v-label>매주마다</v-label>
                            <v-label>상시 거주중</v-label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters class="justify-space-between | pt-6" style="align-content: center">
                    <v-col cols="auto" class="text-bodytitle">물건공유</v-col>
                    <v-col no-gutters cols="auto" class="pt-1">
                        <v-row no-gutters>
                            <v-col cols="auto" class="progress-bar">
                                <div
                                v-for="(step, index) in 5"
                                :key="index"
                                class="circle"
                                :class="{ active: index === props.survey.share }"
                                >
                                <div class="line" v-if="index !== 4"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="justify-space-between | pt-1" style="width: 362px;">
                            <v-label>전혀 안함</v-label>
                            <v-label>공동물품 구비</v-label>
                            <v-label>완전 공유</v-label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters class="justify-space-between | pt-6 | pb-8" style="align-content: center">
                    <v-col cols="auto" class="text-bodytitle">벌레잡이</v-col>
                    <v-col no-gutters cols="auto" class="pt-1">
                        <v-row no-gutters>
                            <v-col cols="auto" class="progress-bar">
                                <div
                                v-for="(step, index) in 5"
                                :key="index"
                                class="circle"
                                :class="{ active: index === props.survey.bug }"
                                >
                                <div class="line" v-if="index !== 4"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="justify-space-between | pt-1" style="width: 362px;">
                            <v-label>못잡음</v-label>
                            <v-label>벌레헌터</v-label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col style="width: 402px; min-width: 402px; max-width: 402px; padding-left: 28px; padding-top: 48px;" >
                <v-row no-gutters style="align-items: center; align-content: center; justify-content: start;">
                    <v-col cols="auto" class="text-bodytitle">수면시간</v-col>
                    <v-col style="padding-left: 10px; padding-bottom: 2px;">
                        <v-icon icon="mdi-white-balance-sunny"></v-icon>
                    </v-col>
                    <v-col cols="auto" class="text-bodytime" style="padding-left: 0px;">{{ props.survey.wakeUp }}</v-col>
                    <v-col style="padding-left: 10px; padding-bottom: 1px;">
                        <v-icon icon="mdi-lightbulb-night"></v-icon>
                    </v-col>
                    <v-col cols="auto" class="text-bodytime" style="padding-left: 0px;">{{ props.survey.lightOff }}</v-col>
                    <v-col  style="padding-left: 10px; padding-bottom: 2px;">
                        <v-icon icon="mdi-weather-night"></v-icon>
                    </v-col>
                    <v-col cols="auto" class="text-bodytime" style="padding-left: 0px;">{{ props.survey.bedTime}}</v-col>
                </v-row>

                <v-row no-gutters style="padding-top:14px">
                    <v-col cols="auto" class="text-bodytitle">수면습관</v-col>
                    <v-col cols="auto" class="text-bodytext" style="padding-left: 32px;">{{ props.survey.sleepHabit }}</v-col>
                </v-row>

                <v-row no-gutters class="justify-space-between" style="align-content: center; padding-top: 24px;">
                    <v-col cols="12" class="text-bodytitle">깔끔선호도</v-col>
                    <v-col no-gutters cols="12" class="pt-4">
                        <v-row no-gutters>
                            <v-col cols="auto" class="progress-bar">
                                <div
                                v-for="(step, index) in 5"
                                :key="index"
                                class="circle"
                                :class="{ active: index === props.survey.clean }"
                                >
                                <div class="line" v-if="index !== 4"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="justify-space-between | pt-4" style="width: 362px;">
                            <v-label>그때그때</v-label>
                            <v-label>늘 깨끗하게</v-label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters class="justify-space-between" style="align-content: center; padding-top: 24px;">
                    <v-col cols="12" class="text-bodytitle">소음예민도</v-col>
                    <v-col no-gutters cols="auto" class="pt-4">
                        <v-row no-gutters>
                            <v-col cols="12" class="progress-bar">
                                <div
                                v-for="(step, index) in 5"
                                :key="index"
                                class="circle"
                                :class="{ active: index === props.survey.noise }"
                                >
                                <div class="line" v-if="index !== 4"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="justify-space-between | pt-4" style="width: 362px;">
                            <v-label>항상 이어폰</v-label>
                            <v-label>작은소리 허용</v-label>
                            <v-label>스피커 모드</v-label>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row no-gutters class="justify-space-between | pb-8" style="align-content: center; padding-top: 24px;">
                    <v-col cols="12" class="text-bodytitle">실내취식</v-col>
                    <v-col no-gutters cols="12" class="pt-4">
                        <v-row no-gutters>
                            <v-col cols="auto" class="progress-bar">
                                <div
                                v-for="(step, index) in 5"
                                :key="index"
                                class="circle"
                                :class="{ active: index === props.survey.eatIn }"
                                >
                                <div class="line" v-if="index !== 4"></div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row no-gutters class="justify-space-between | pt-4" style="width: 362px;">
                            <v-label>방밖에서만</v-label>
                            <v-label>전혀 상관없음</v-label>
                        </v-row>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>
        <v-divider :thickness="3"></v-divider>
        <v-row 
            no-gutters 
            style="padding-top: 8px; padding-bottom: 8px; justify-content: start; align-items: center;"
        >
            <v-col>
                <v-row no-gutters class="justify-end" style="align-items: center;">
                     <v-label>generated by 룸메이트 찾기 - 둥지동지</v-label>
                </v-row>
                <v-row no-gutters style="height: 45px; align-items: center;">
                    <v-chip-group
                        class="icon-chip"
                    >
                        <v-chip
                                variant="outlined" :color="getColor" border="md"
                                asdf
                            >
                            <v-icon icon="mdi-tag-text-outline"></v-icon>
                        </v-chip>
                    </v-chip-group>
                    <v-chip-group
                        multiple
                        column
                        class="tag-chip"
                    >
                        <v-chip
                            v-for="(tag, index) in props.survey.selectTag"
                            :key="index"
                            outlined
                            variant="outlined" :color="getColor" border="md"
                            class="tag-chip"
                        >
                        {{ tag }}
                        </v-chip>
                    </v-chip-group>
                </v-row>
                <v-row no-gutters style="height: 45px; align-items: center;">
                    <v-chip-group
                        class="icon-chip"
                    >
                        <v-chip
                                variant="outlined" :color="getColor" border="md"
                                asdf
                            >
                            <v-icon icon="mdi-plus"></v-icon>
                        </v-chip>
                    </v-chip-group>
                    <v-col class="tag-text | d-flex | justify-start | align-center" style="height: 40px;">
                        {{ props.survey.notes }}
                    </v-col>
                </v-row>
            </v-col>            
        </v-row>
    </v-container>
</template>
  

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";

const props = defineProps({
    survey: Object
});

const survey = ref(null)

const getColor = ref('#FF5858'); 

// ----- 라이프 사이클 ----- //
onMounted(() => {
    console.log('component get survey object', props.survey);
    survey.value = props.survey;
});

onUnmounted(() => {

})

watch(() => props.survey.color, (newColor) => {
    getColor.value = newColor;
}, { immediate: true });


// ----- 함수 정의 ----- //

</script>

<style scoped>
.text-title {
    color: #000;
    text-align: right;
    font-size: 85px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.text-subtitle {
    color: v-bind('getColor');
    text-align: right;
    font-size: 48px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.text-bodytitle {
    color: v-bind('getColor');
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.text-bodytext {
    color: #000;
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.text-bodytime {
    color: #000;
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.sd-label {
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.style-stroke {
    stroke-width: 1.034px;
    stroke: #000;
}

.main-info-pill {
    border-radius: 69px;
    border: 2px solid #B9B9B9;
    background: #F7F7F7;
    justify-content: start;
    align-items: center;
    padding-left: 21px;
    padding-top: 14px;
    padding-bottom: 14px;
}
.main-info-title {
    color: #000;
    text-align: center;
    font-size: 26.5px;
    font-style: normal;
    font-weight: 700;
    justify-content: center;
    align-items: center;
}
.main-info-icon {
    width: 90px;
    height: 90px;
    min-width: 90px;
    min-height: 90px;
    max-width: 90px;
    max-height: 90px;
    border: 2px solid #E9E9E9;
    background: #FFF;
}

.tag-chip :deep(.v-chip) {
  border-color: v-bind('getColor') !important; /* 테두리 색상 변경 */
  color: #000000 !important; /* 텍스트 색상 */
  height: 40px;
  min-width: 40px;
  align-content: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 400;
}

.icon-chip :deep(.v-chip) {
  height: 40px;
  width: 40px;
  align-content: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 400;
}

.tag-text {
    color: #000;
    font-size: 23px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

:deep(.v-chip .v-icon) {
    color:  v-bind('getColor') !important; /* 아이콘 색상 */
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px; /* 원 사이 간격 */
}

.circle {
  position: relative;
  width: 24.5px;
  height: 24.5px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: #f5f5f5; /* 기본 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle.active {
    background-color: v-bind('getColor'); /* 현재 단계 배경색 */
}

.line {
  position: absolute;
  width: 60px;
  height: 0.5px;
  background-color: black;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
}
</style>


