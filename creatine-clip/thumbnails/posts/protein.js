// "أفضل 5 مصادر البروتين" — content for card-post.html.
// Values are approximate (USDA FoodData Central). Tuna: one round can, ~120g drained, in oil.
// Images: Fluent Emoji 3D (MIT); sardines edited from it; tuna.svg drawn for this post.
const food = (name, img, serving, p, kcal, fat, tag) => ({
  name, img: `../food3d/${img}`, serving, big: p, label: 'بروتين',
  pill: `<span class="l">${kcal} kcal</span> · ${fat} دهون`, tag,
});
const POST = {
  cover: ['أفضل 5 مصادر', 'البروتين'],
  items: [
    food('صدر الدجاج', 'chicken.png', '100g طايب', '31g', 165, '3.6g', 'قليل الدهون وغني بالبروتين'),
    food('البيض', 'egg.png', 'بيضة وحدة', '6g', 72, '4.8g', 'بروتين كامل وساهل فالطياب'),
    food('الطون', 'tuna.svg', 'علبة طون', '35g', 238, '10g', 'ساهل وجاهز فأي وقت'),
    food('اللحم', 'meat.png', '100g لحم بقري قليل الدهون', '26g', 217, '12g', 'غني بالبروتين والحديد'),
    food('السردين', 'sardines.png', '100g', '25g', 208, '11g', 'غني بالأوميغا 3'),
  ],
  note: 'القيم تقريبية',
  tip: {
    title: 'نصيحة',
    paras: ['<b>البروتين</b> من بين أهم العناصر الغذائية لبناء العضلات.', 'ختار داك الشي اللي عندك.'],
    cta: 'سيف البوسط باش ترجع ليه',
  },
};
