<template>
    <v-container 
        class="card-container"
    >
        <v-row
            no-gutters
            class="img-container | elevation-1"
        >
        </v-row>

        <v-row
            no-gutters
            class="justify-center | align-center | text-center | mt-6"
        >
            <v-col cols=12 class="card-title">
                {{ props.result.Card_title }}
            </v-col>
            <v-col cols="12" class="card-desc | mt-3">
                {{ props.result.Card_lore }}
            </v-col>
        </v-row>

        <!-- <v-row 
            v-if="props.loading" 
            no-gutters justify="center" align-content="center" 
            style="min-height: 300px; min-width: 300px;"
            >
            <v-progress-circular
                indeterminate
                color="#FF794C"
                size="64"
                class="progress-circular"
            ></v-progress-circular>
        </v-row> -->
    </v-container>
</template>
  

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";

const props = defineProps({
    result: Object,
    loading: Boolean
});

const result = ref(null)

// ----- 라이프 사이클 ----- //
onMounted(() => {
    console.log('component get result object', props.result);
    result.value = props.result;
});

onUnmounted(() => {

})

// ----- 함수 정의 ----- //

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


