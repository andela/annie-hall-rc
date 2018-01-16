import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Carousel",
  name: "reaction-ui-carousel",
  icon: "glyphicon-chevron-left glyphicon glyphicon-chevron-right",
  autoEnable: true,
  registry: [
    {
      name: "Carousel",
      provides: ["carousel"],
      template: "carousel"
    }
  ]
});
