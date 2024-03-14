import {ref, reactive} from "vue"
import {logout, updatepassword} from "~/api/manager.js";
import {toast, showModal} from "~/composables/util.js";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export function useRepassword() {
    const router = useRouter();
    const store = useStore();
    const formDrawerRef = ref(null);
    const form = reactive({
        oldpassword: "",
        password: "",
        repassword: ""
    })
    const rules = {
        oldpassword: [
            {required: true, message: '旧密码密码必填', trigger: 'blur'},
            {min: 5, max: 18, message: '旧密码长度5到18位', trigger: 'blur'},
        ],
        password: [
            {required: true, message: '新密码必填', trigger: 'blur'},
            {min: 5, max: 18, message: '新密码长度5到18位', trigger: 'blur'},
        ]
        ,
        repassword: [
            {required: true, message: '确认密码必填', trigger: 'blur'},
            {min: 5, max: 18, message: '确认密码长度5到18位', trigger: 'blur'},
        ]

    }
    const formRef = ref(null);

    function onsubmit() {
        console.log(store)
        formRef.value.validate((valid) => {
            if (!valid) {
                return false;
            } else {
                formDrawerRef.value.showLoading();
                /*store.dispatch("login",form).then(res=>{
                    toast("登录成功","success");
                    router.push("/")
                }).finally(()=>{
                    loading.value=false;
                })*/
                updatepassword(form).then((res) => {
                    toast("修改密码成功！请重新登录！");
                    store.dispatch("logout");
                    router.push("/login");
                }).finally(() => {
                    formDrawerRef.value.hideLoading();
                })
            }
        })
    }

    const openRePasswordForm = () => formDrawerRef.value.open();
    return {
        formDrawerRef,
        form,
        rules,
        formRef,
        onsubmit,
        openRePasswordForm
    }

}

export function useLogout() {
    const router = useRouter();
    const store = useStore();
     function handleLogout() {

        showModal("是否要推出登录").then((res) => {
            logout().then(res => {

            }).finally(() => {
                store.dispatch("logout");
                router.push("/login")
                toast("推出登录成功")
            })
        })
    }
    return {
         handleLogout
    }
}