// Museum images are grouped by activity, verified against slide 8 of the supplied portfolio.
const img=(n,caption)=>({file:`assets/2026/s8_${n}.jpg`,caption});
module.exports=[
 {id:'museum-day',title:'5·18 国际博物馆日',text:'以活动、打卡物料和文创连接公众参与。',images:[img(1,'国际博物馆日公众活动'),img(4,'国际博物馆日活动现场'),img(5,'馆藏元素打卡物料'),img(6,'人类博物馆主题打卡牌'),img(7,'博物馆日活动物料')]},
 {id:'school-outreach',title:'科普进校园',text:'用系列展板与现场交流将馆藏文化带进校园。',detail:'围绕文化故事与公众阅读习惯拆解原始资料，规划视觉风格和图文逻辑。主题活动累计完成 20 张海报、24 张科普展板；将馆藏元素延展为可传播、可体验的文化载体。',images:[img(2,'校园科普展板落地'),img(3,'学生参观科普展示')],posters:[img(8,'薪火相传主题海报'),img(9,'文化长征主题海报'),img(10,'少年担当主题海报'),img(14,'闽海日课科普展板 · 器物'),img(15,'闽海日课科普展板 · 乐器'),img(16,'闽海日课科普展板 · 纹样')]},
 {id:'new-year',title:'文物的新年状态',text:'把文物特征连接到节日语境，形成易传播的主题内容。',images:[img(17,'文物的新年状态 · 三彩马'),img(18,'文物的新年状态 · 白釉八角公道杯'),img(19,'文物的新年状态 · 玉璧')]}
];
