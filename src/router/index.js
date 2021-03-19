import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Define from '../util/define';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes : routes
});

// firebase 로그인 대기
const firebaseAuthWait = function () {
    let cnt = 0;
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            cnt++;
            if (store.state.user.firebaseLoaded) {
                clearInterval(timer);
              //  console.log("Firebase Wait end");
                resolve();
            } else if (cnt > 200) {
                clearInterval(timer);
              //  reject(Error("파이어 베이스 로그 실패"));
            }
        }, 10);
    });
}

router.beforeEach(async (to, from, next) => {
    // 파이어 베이스 인증이 로드되지 않으면 기다린다.
    if (store.state.user.firebaseLoaded == false) {
        Vue.prototype.$Progress.start();
        await firebaseAuthWait();
        Vue.prototype.$Progress.finish();
    }

    const access = to.matched[0].meta.access || 'every';
    const accessLevel = to.matched[0].meta.accessLevel || Define.LV.NOMEMBER;
    const user = store.state.user.user;

    switch (access) {
        case 'Auth': // 회원만 접근 가능
            if (user == null) { // 로그인 하지 않았으면 로그인페이지로
                next({ path: `/login?url=${to.path}&query=${JSON.stringify(to.query)}` });
            } else if (accessLevel > user.mb_level) { // 유저 레벨이 낮으면 접근 차단
                Vue.toasted.error("접근권한이 없습니다.", { duration: 7000, });
                next({ name: "Home" });
            } else {
                next();
            }
            break;
        case 'noAuth': // 비회원만 접근 가능
            if (user != null) { // 로그인된 유저이면 접근 차단
                Vue.toasted.error("이미 로그인 되었습니다.", { duration: 7000, });
                if (from.name)
                    next(false);
                else
                    next({ name: "Home" });
            } else {
                next();
            }
            break;
        default: // 아무나 접근 가능
            next();
            break;
    }
});

router.afterEach((to, from) => {

});


export default router;
