import Vue from "vue";

let globals = {
    user: null,
    group: null,
    color: 'primary',
    dark: true
};

export function setUser(user) {
    globals.user = user;
}

export function setGroup(group) {
    globals.group = group;
    globals.color = group.group.color || 'primary';
    if (globals.color === 'primary') {
        globals.dark = true;
    } else {
        let c = globals.color.substring(1);
        let rgb = parseInt(c, 16);
        let r = (rgb >> 16) & 0xff;
        let g = (rgb >> 8) & 0xff;
        let b = (rgb >> 0) & 0xff;
        let l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        globals.dark = l < 0.5;
    }
}

Vue.use({
    install: function () {
        Object.defineProperty(Vue.prototype, '$globals', {
            get() {
                return globals
            }
        })
    }
});

export default globals
