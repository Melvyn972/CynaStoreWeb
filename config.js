import themes from "daisyui/src/theming/themes";

const config = {
    appName: "Cyna",
    appDescription:
        "CYNA est un pure player en cybersécurité pour les PME et MSP. La qualité de service est au cœur de notre métier, où nous privilégions l'expertise, la proximité et la rapidité d'exécution. ",
    domainName: "localhost:3000",
    colors: {
        theme: "light",
        main: themes["light"]["primary"],
    },
    auth: {
        loginUrl: "/auth/login",
        callbackUrl: "/dashboard",
    },
};

export default config;
