"use client";
import { useEffect, useRef } from "react";

const regex =
  /[\u{00A7}\u{00A9}\u{00AE}\u{00B1}\u{00BC}-\u{00BE}\u{00D7}\u{00F7}\u{02EA}-\u{02EB}\u{1100}-\u{11FF}\u{1401}-\u{166C}\u{166D}\u{166E}\u{166F}-\u{167F}\u{18B0}-\u{18F5}\u{18F6}-\u{18FF}\u{2016}\u{2020}-\u{2021}\u{2030}-\u{2031}\u{203B}-\u{203C}\u{2042}\u{2047}-\u{2049}\u{2051}\u{2065}\u{20DD}-\u{20E0}\u{20E2}-\u{20E4}\u{2100}-\u{2101}\u{2103}-\u{2106}\u{2107}\u{2108}-\u{2109}\u{210F}\u{2113}\u{2114}\u{2116}-\u{2117}\u{211E}-\u{2123}\u{2125}\u{2127}\u{2129}\u{212E}\u{2135}-\u{2138}\u{2139}\u{213A}-\u{213B}\u{213C}-\u{213F}\u{2145}-\u{2149}\u{214A}\u{214C}-\u{214D}\u{214F}\u{2150}-\u{215F}\u{2160}-\u{2182}\u{2183}-\u{2184}\u{2185}-\u{2188}\u{2189}\u{218C}-\u{218F}\u{221E}\u{2234}-\u{2235}\u{2300}-\u{2307}\u{230C}-\u{231F}\u{2324}-\u{2328}\u{232B}\u{237D}-\u{239A}\u{23BE}-\u{23CD}\u{23CF}\u{23D1}-\u{23DB}\u{23E2}-\u{23FF}\u{2400}-\u{2422}\u{2424}-\u{2426}\u{2427}-\u{243F}\u{2440}-\u{244A}\u{244B}-\u{245F}\u{2460}-\u{249B}\u{249C}-\u{24E9}\u{24EA}-\u{24FF}\u{25A0}-\u{25B6}\u{25B7}\u{25B8}-\u{25C0}\u{25C1}\u{25C2}-\u{25F7}\u{25F8}-\u{25FF}\u{2600}-\u{2619}\u{2620}-\u{266E}\u{266F}\u{2670}-\u{26FF}\u{2700}-\u{2767}\u{2776}-\u{2793}\u{2B12}-\u{2B2F}\u{2B50}-\u{2B59}\u{2B97}\u{2BB8}-\u{2BD1}\u{2BD3}-\u{2BEB}\u{2BF0}-\u{2BFF}\u{2E50}-\u{2E51}\u{2E80}-\u{2E99}\u{2E9A}\u{2E9B}-\u{2EF3}\u{2EF4}-\u{2EFF}\u{2F00}-\u{2FD5}\u{2FD6}-\u{2FDF}\u{2FE0}-\u{2FEF}\u{2FF0}-\u{2FFB}\u{2FFC}-\u{2FFF}\u{3000}\u{3001}-\u{3002}\u{3003}\u{3004}\u{3005}\u{3006}\u{3007}\u{3012}-\u{3013}\u{3020}\u{3021}-\u{3029}\u{302A}-\u{302D}\u{302E}-\u{302F}\u{3031}-\u{3035}\u{3036}-\u{3037}\u{3038}-\u{303A}\u{303B}\u{303C}\u{303D}\u{303E}-\u{303F}\u{3040}\u{3041}\u{3042}\u{3043}\u{3044}\u{3045}\u{3046}\u{3047}\u{3048}\u{3049}\u{304A}-\u{3062}\u{3063}\u{3064}-\u{3082}\u{3083}\u{3084}\u{3085}\u{3086}\u{3087}\u{3088}-\u{308D}\u{308E}\u{308F}-\u{3094}\u{3095}-\u{3096}\u{3097}-\u{3098}\u{3099}-\u{309A}\u{309B}-\u{309C}\u{309D}-\u{309E}\u{309F}\u{30A1}\u{30A2}\u{30A3}\u{30A4}\u{30A5}\u{30A6}\u{30A7}\u{30A8}\u{30A9}\u{30AA}-\u{30C2}\u{30C3}\u{30C4}-\u{30E2}\u{30E3}\u{30E4}\u{30E5}\u{30E6}\u{30E7}\u{30E8}-\u{30ED}\u{30EE}\u{30EF}-\u{30F4}\u{30F5}-\u{30F6}\u{30F7}-\u{30FA}\u{30FB}\u{30FD}-\u{30FE}\u{30FF}\u{3100}-\u{3104}\u{3105}-\u{3126}\u{3127}\u{3128}-\u{312F}\u{3130}\u{3131}-\u{318E}\u{318F}\u{3190}-\u{3191}\u{3192}-\u{3195}\u{3196}-\u{319F}\u{31A0}-\u{31BF}\u{31C0}-\u{31E3}\u{31E4}-\u{31EF}\u{31F0}-\u{31FF}\u{3200}-\u{321E}\u{321F}\u{3220}-\u{3229}\u{322A}-\u{3247}\u{3248}-\u{324F}\u{3250}\u{3251}-\u{325F}\u{3260}-\u{327F}\u{3280}-\u{3289}\u{328A}-\u{32B0}\u{32B1}-\u{32BF}\u{32C0}-\u{32FE}\u{32FF}\u{3300}-\u{3357}\u{3358}-\u{337A}\u{337B}-\u{337F}\u{3380}-\u{33FF}\u{3400}-\u{4DBF}\u{4DC0}-\u{4DFF}\u{4E00}-\u{9FFF}\u{A000}-\u{A014}\u{A015}\u{A016}-\u{A48C}\u{A48D}-\u{A48F}\u{A490}-\u{A4C6}\u{A4C7}-\u{A4CF}\u{A960}-\u{A97C}\u{A97D}-\u{A97F}\u{AC00}-\u{D7A3}\u{D7A4}-\u{D7AF}\u{D7B0}-\u{D7C6}\u{D7C7}-\u{D7CA}\u{D7CB}-\u{D7FB}\u{D7FC}-\u{D7FF}\u{E000}-\u{F8FF}\u{F900}-\u{FA6D}\u{FA6E}-\u{FA6F}\u{FA70}-\u{FAD9}\u{FADA}-\u{FAFF}\u{FE10}-\u{FE16}\u{FE17}\u{FE18}\u{FE19}\u{FE1A}-\u{FE1F}\u{FE30}\u{FE31}-\u{FE32}\u{FE33}-\u{FE34}\u{FE35}\u{FE36}\u{FE37}\u{FE38}\u{FE39}\u{FE3A}\u{FE3B}\u{FE3C}\u{FE3D}\u{FE3E}\u{FE3F}\u{FE40}\u{FE41}\u{FE42}\u{FE43}\u{FE44}\u{FE45}-\u{FE46}\u{FE47}\u{FE48}\u{FE50}-\u{FE52}\u{FE53}\u{FE54}-\u{FE57}\u{FE5F}-\u{FE61}\u{FE62}\u{FE67}\u{FE68}\u{FE69}\u{FE6A}-\u{FE6B}\u{FE6C}-\u{FE6F}\u{FF01}\u{FF02}-\u{FF03}\u{FF04}\u{FF05}-\u{FF07}\u{FF0A}\u{FF0B}\u{FF0C}\u{FF0E}\u{FF0F}\u{FF10}-\u{FF19}\u{FF1F}\u{FF20}\u{FF21}-\u{FF3A}\u{FF3C}\u{FF3E}\u{FF40}\u{FF41}-\u{FF5A}\u{FFE0}-\u{FFE1}\u{FFE2}\u{FFE4}\u{FFE5}-\u{FFE6}\u{FFE7}\u{FFF0}-\u{FFF8}\u{FFFC}-\u{FFFD}\u{10980}-\u{1099F}\u{11580}-\u{115AE}\u{115AF}-\u{115B1}\u{115B2}-\u{115B5}\u{115B6}-\u{115B7}\u{115B8}-\u{115BB}\u{115BC}-\u{115BD}\u{115BE}\u{115BF}-\u{115C0}\u{115C1}-\u{115D7}\u{115D8}-\u{115DB}\u{115DC}-\u{115DD}\u{115DE}-\u{115FF}\u{11A00}\u{11A01}-\u{11A0A}\u{11A0B}-\u{11A32}\u{11A33}-\u{11A38}\u{11A39}\u{11A3A}\u{11A3B}-\u{11A3E}\u{11A3F}-\u{11A46}\u{11A47}\u{11A48}-\u{11A4F}\u{11A50}\u{11A51}-\u{11A56}\u{11A57}-\u{11A58}\u{11A59}-\u{11A5B}\u{11A5C}-\u{11A89}\u{11A8A}-\u{11A96}\u{11A97}\u{11A98}-\u{11A99}\u{11A9A}-\u{11A9C}\u{11A9D}\u{11A9E}-\u{11AA2}\u{11AA3}-\u{11AAF}\u{11AB0}-\u{11ABF}\u{13000}-\u{1342E}\u{1342F}\u{13430}-\u{13438}\u{13439}-\u{1343F}\u{14400}-\u{14646}\u{14647}-\u{1467F}\u{16FE0}-\u{16FE1}\u{16FE2}\u{16FE3}\u{16FE4}\u{16FE5}-\u{16FEF}\u{16FF0}-\u{16FF1}\u{16FF2}-\u{16FFF}\u{17000}-\u{187F7}\u{187F8}-\u{187FF}\u{18800}-\u{18AFF}\u{18B00}-\u{18CD5}\u{18CD6}-\u{18CFF}\u{18D00}-\u{18D08}\u{18D09}-\u{18D7F}\u{1AFF0}-\u{1AFF3}\u{1AFF4}\u{1AFF5}-\u{1AFFB}\u{1AFFC}\u{1AFFD}-\u{1AFFE}\u{1AFFF}\u{1B000}-\u{1B0FF}\u{1B100}-\u{1B122}\u{1B123}-\u{1B12F}\u{1B130}-\u{1B14F}\u{1B150}-\u{1B152}\u{1B153}-\u{1B163}\u{1B164}-\u{1B167}\u{1B168}-\u{1B16F}\u{1B170}-\u{1B2FB}\u{1B2FC}-\u{1B2FF}\u{1CF00}-\u{1CF2D}\u{1CF2E}-\u{1CF2F}\u{1CF30}-\u{1CF46}\u{1CF47}-\u{1CF4F}\u{1CF50}-\u{1CFC3}\u{1CFC4}-\u{1CFCF}\u{1D000}-\u{1D0F5}\u{1D0F6}-\u{1D0FF}\u{1D100}-\u{1D126}\u{1D127}-\u{1D128}\u{1D129}-\u{1D164}\u{1D165}-\u{1D166}\u{1D167}-\u{1D169}\u{1D16A}-\u{1D16C}\u{1D16D}-\u{1D172}\u{1D173}-\u{1D17A}\u{1D17B}-\u{1D182}\u{1D183}-\u{1D184}\u{1D185}-\u{1D18B}\u{1D18C}-\u{1D1A9}\u{1D1AA}-\u{1D1AD}\u{1D1AE}-\u{1D1EA}\u{1D1EB}-\u{1D1FF}\u{1D2E0}-\u{1D2F3}\u{1D2F4}-\u{1D2FF}\u{1D300}-\u{1D356}\u{1D357}-\u{1D35F}\u{1D360}-\u{1D378}\u{1D379}-\u{1D37F}\u{1D800}-\u{1D9FF}\u{1DA00}-\u{1DA36}\u{1DA37}-\u{1DA3A}\u{1DA3B}-\u{1DA6C}\u{1DA6D}-\u{1DA74}\u{1DA75}\u{1DA76}-\u{1DA83}\u{1DA84}\u{1DA85}-\u{1DA86}\u{1DA87}-\u{1DA8B}\u{1DA8C}-\u{1DA9A}\u{1DA9B}-\u{1DA9F}\u{1DAA0}\u{1DAA1}-\u{1DAAF}\u{1F000}-\u{1F02B}\u{1F02C}-\u{1F02F}\u{1F030}-\u{1F093}\u{1F094}-\u{1F09F}\u{1F0A0}-\u{1F0AE}\u{1F0AF}-\u{1F0B0}\u{1F0B1}-\u{1F0BF}\u{1F0C0}\u{1F0C1}-\u{1F0CF}\u{1F0D0}\u{1F0D1}-\u{1F0F5}\u{1F0F6}-\u{1F0FF}\u{1F100}-\u{1F10C}\u{1F10D}-\u{1F1AD}\u{1F1AE}-\u{1F1E5}\u{1F1E6}-\u{1F1FF}\u{1F200}-\u{1F201}\u{1F202}\u{1F203}-\u{1F20F}\u{1F210}-\u{1F23B}\u{1F23C}-\u{1F23F}\u{1F240}-\u{1F248}\u{1F249}-\u{1F24F}\u{1F250}-\u{1F251}\u{1F252}-\u{1F25F}\u{1F260}-\u{1F265}\u{1F266}-\u{1F2FF}\u{1F300}-\u{1F3FA}\u{1F3FB}-\u{1F3FF}\u{1F400}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F650}-\u{1F67F}\u{1F680}-\u{1F6D7}\u{1F6D8}-\u{1F6DC}\u{1F6DD}-\u{1F6EC}\u{1F6ED}-\u{1F6EF}\u{1F6F0}-\u{1F6FC}\u{1F6FD}-\u{1F6FF}\u{1F700}-\u{1F773}\u{1F774}-\u{1F77F}\u{1F780}-\u{1F7D8}\u{1F7D9}-\u{1F7DF}\u{1F7E0}-\u{1F7EB}\u{1F7EC}-\u{1F7EF}\u{1F7F0}\u{1F7F1}-\u{1F7FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA53}\u{1FA54}-\u{1FA5F}\u{1FA60}-\u{1FA6D}\u{1FA6E}-\u{1FA6F}\u{1FA70}-\u{1FA74}\u{1FA75}-\u{1FA77}\u{1FA78}-\u{1FA7C}\u{1FA7D}-\u{1FA7F}\u{1FA80}-\u{1FA86}\u{1FA87}-\u{1FA8F}\u{1FA90}-\u{1FAAC}\u{1FAAD}-\u{1FAAF}\u{1FAB0}-\u{1FABA}\u{1FABB}-\u{1FABF}\u{1FAC0}-\u{1FAC5}\u{1FAC6}-\u{1FACF}\u{1FAD0}-\u{1FAD9}\u{1FADA}-\u{1FADF}\u{1FAE0}-\u{1FAE7}\u{1FAE8}-\u{1FAEF}\u{1FAF0}-\u{1FAF6}\u{1FAF7}-\u{1FAFF}\u{20000}-\u{2A6DF}\u{2A6E0}-\u{2A6FF}\u{2A700}-\u{2B738}\u{2B739}-\u{2B73F}\u{2B740}-\u{2B81D}\u{2B81E}-\u{2B81F}\u{2B820}-\u{2CEA1}\u{2CEA2}-\u{2CEAF}\u{2CEB0}-\u{2EBE0}\u{2EBE1}-\u{2F7FF}\u{2F800}-\u{2FA1D}\u{2FA1E}-\u{2FFFD}\u{30000}-\u{3134A}\u{3134B}-\u{3134F}\u{31350}-\u{3FFFD}]/u;

let context = {
  vertical: true,
};

export function AnimateCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    const canvas = ref.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d")!;
    const fontFamily = getComputedStyle(document.body).fontFamily;
    const dpr = window.devicePixelRatio || 1;
    const objects: Renderer[] = [];
    let mounted = true;

    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const loop = () => {
      if (!mounted) return;
      ctx.font = `50px ${fontFamily}`;
      ctx.strokeStyle = ctx.fillStyle = "white";

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      context.vertical = true;
      for (const object of objects) {
        object.render();
      }

      requestAnimationFrame(loop);
    };

    const text = "「死にたいなんて言うなよ。」";
    for (let i = 0; i < text.length; i++) {
      objects.push(createCharRender(ctx, text.charAt(i), 40, i * 60, i * 50));
    }

    loop();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={ref} className="w-full h-full" />
    </div>
  );
}

type Renderer = {
  render: () => void;
};

function createCharRender(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  delay: number
) {
  let dashLen = 220,
    dashOffset = dashLen,
    speed = 5;

  return {
    render: () => {
      delay -= speed;
      if (delay < 0) {
        dashOffset -= speed;
      }

      ctx.save();
      ctx.textBaseline = "top";
      ctx.textAlign = "start";
      ctx.translate(x, y);
      if (context.vertical && char === "。") {
        ctx.translate(0, ctx.measureText(char).actualBoundingBoxRight);
        ctx.rotate(-Math.PI / 2);
      }
      if (context.vertical && !char.match(regex)) {
        ctx.translate(ctx.measureText(char).width, 0);
        ctx.rotate(Math.PI / 2);
      }

      ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]);
      ctx.fillStyle = "black";
      ctx.fillText(char, 0, 0);
      ctx.globalCompositeOperation = "source-atop";

      ctx.strokeStyle = "white";
      ctx.lineWidth = 10;
      ctx.strokeText(char, 0, 0);

      ctx.restore();
    },
  };
}
