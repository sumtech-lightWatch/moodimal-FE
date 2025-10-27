<template>
    <v-container 
        style="width: 1000px; height: 1000px; min-width: 1000px; min-height: 1000px; max-width: 1000px; max-height: 1000px; padding: 30px;"
    >
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

// ----- 함수 정의 ----- //

</script>

<style scoped>

</style>


