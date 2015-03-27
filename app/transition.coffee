`import { animate, stop } from "liquid-fire"`

transitionMap = ->
  @transition @fromRoute("index"), @toRoute("about"), @use("toDown"), @reverse("toUp")
  @transition @fromRoute("about"), @toRoute("works"), @use("toDown"), @reverse("toUp")
  @transition @fromRoute("works"), @toRoute("contact"), @use("toDown"), @reverse("toUp")

  @transition @fromRoute("index"), @toRoute("contact"), @use("toDown"), @reverse("toUp")
  @transition @fromRoute("about"), @toRoute("contact"), @use("toDown"), @reverse("toUp")

`export default transitionMap`