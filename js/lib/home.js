mixins.home = {
    data() {
        return {
            coverScrolling: false,
        };
    },
    mounted() {
        let background = this.$refs.homeBackground;
        let images = background.dataset.images.split(",");
        let id = Math.floor(Math.random() * images.length);
        background.style.backgroundImage = `url('${images[id]}')`;
        this.menuColor = true;
        // 在封面处向下滚动一次滚轮即平滑滚到文章列表，无需手动滑过整个封面
        this.coverWheelHandler = (event) => {
            if (event.deltaY <= 0 || this.coverScrolling) return;
            if (window.scrollY < 10) {
                event.preventDefault();
                this.coverScrolling = true;
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                setTimeout(() => {
                    this.coverScrolling = false;
                }, 800);
            }
        };
        window.addEventListener("wheel", this.coverWheelHandler, { passive: false });
    },
    unmounted() {
        window.removeEventListener("wheel", this.coverWheelHandler);
    },
    methods: {
        homeClick() {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        },
    },
};
