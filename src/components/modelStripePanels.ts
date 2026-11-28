type StripePanel = {
  path: string;
  angle: number;
  phase: number;
  bend?: number;
};

// Stripe grain is cut independently for each garment panel. Coordinates follow the
// visible seams in the original, uncropped model portraits.
const panels: Readonly<Record<string, readonly StripePanel[]>> = {
  "pose-1": [
    { path: "M215 210H264Q296 243 294 290Q293 342 281 365Q286 402 309 450L322 526H215Z", angle: -12, phase: 5, bend: 2 },
    { path: "M489 181H565V528L414 553L371 510Q450 445 466 405Q490 311 475 261Q474 223 489 181Z", angle: 23, phase: 4, bend: -4 },
    { path: "M315 161L341 166L370 201L416 149L444 173L410 189L372 220L345 210L324 186Z", angle: 79, phase: 8 },
    { path: "M249 485L311 481L321 526L258 538Z", angle: 74, phase: 7 },
    { path: "M398 478L441 514L412 548L370 513Z", angle: -52, phase: 9 },
  ],
  "pose-2": [
    { path: "M162 263H251Q276 285 266 318Q255 371 239 390L268 452L170 475Z", angle: 14, phase: 5, bend: -3 },
    { path: "M457 238L506 247V483H454L421 437Q449 397 431 362L428 319Q436 273 457 238Z", angle: -11, phase: 8, bend: 2 },
    { path: "M280 243L305 257L323 276L312 303L278 286L262 269Z", angle: -40, phase: 5 },
    { path: "M359 208L396 224L376 270L342 298L332 292L350 260Z", angle: 36, phase: 10 },
    { path: "M171 405Q208 407 245 438L236 456L173 465Z", angle: 72, phase: 7 },
    { path: "M423 414L491 438L491 474L451 476Z", angle: -58, phase: 7 },
  ],
  "pose-3": [
    { path: "M156 323L216 320Q241 353 227 397Q223 456 222 487L209 590L152 595Z", angle: 5, phase: 7, bend: -2 },
    { path: "M448 329L519 336V641L444 645L410 604Q434 570 438 532Q431 471 430 427Q429 367 448 329Z", angle: -10, phase: 9, bend: 3 },
    { path: "M268 283L285 291L291 329L285 361L260 341L244 330Z", angle: -38, phase: 6 },
    { path: "M365 272L393 300L373 335L336 355L322 355L336 322Z", angle: 44, phase: 6 },
    { path: "M151 553Q180 549 215 561L215 588L151 597Z", angle: 78, phase: 8 },
    { path: "M421 582L480 604L480 636L436 645L408 617Z", angle: -69, phase: 9 },
  ],
  "pose-4": [
    { path: "M118 305L182 298Q212 332 212 371L197 494L120 484Z", angle: 13, phase: 7, bend: -2 },
    { path: "M470 283L553 304V487L442 495L433 452Q446 406 432 371Q428 323 470 283Z", angle: -13, phase: 5, bend: 3 },
    { path: "M262 237L279 253L289 298L302 334L266 314L231 279Z", angle: -38, phase: 8 },
    { path: "M354 221L391 251L378 295L341 330L326 330L338 282Z", angle: 31, phase: 5 },
  ],
};

export function getModelStripePanels(src: string) {
  const pose = src.match(/pose-\d+/)?.[0] ?? "";
  return panels[pose] ?? [];
}
