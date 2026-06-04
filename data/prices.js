// ============================================================
// 高速公路路产赔偿标准数据集
// 来源：粤交路〔1998〕38号 + 粤交路〔1999〕263号（增补） + 粤公路函〔2020〕352号（增补）
// ============================================================

// ---- 合并后的分类列表（供计算器主页使用） ----
var categories = [
  {
    id: 'signage',
    name: '标志牌',
    items: [
      { id: 'tri-130-high', name: '三角形反光标志牌', spec: '边长130cm 高强级', unit: '块', price: 2120, source: '1998' },
      { id: 'tri-130-eng', name: '三角形反光标志牌', spec: '边长130cm 工程级', unit: '块', price: 1150, source: '1998' },
      { id: 'tri-110-high', name: '三角形反光标志牌', spec: '边长110cm 高强级', unit: '块', price: 1520, source: '1998' },
      { id: 'tri-110-eng', name: '三角形反光标志牌', spec: '边长110cm 工程级', unit: '块', price: 830, source: '1998' },
      { id: 'tri-90-high', name: '三角形反光标志牌', spec: '边长90cm 高强级', unit: '块', price: 1015, source: '1998' },
      { id: 'tri-90-eng', name: '三角形反光标志牌', spec: '边长90cm 工程级', unit: '块', price: 550, source: '1998' },
      { id: 'tri-70-high', name: '三角形反光标志牌', spec: '边长70cm 高强级', unit: '块', price: 610, source: '1998' },
      { id: 'tri-70-eng', name: '三角形反光标志牌', spec: '边长70cm 工程级', unit: '块', price: 330, source: '1998' },
      { id: 'circle-120-high', name: '圆形反光标志牌', spec: '直径120cm 高强级', unit: '块', price: 2090, source: '1998' },
      { id: 'circle-120-eng', name: '圆形反光标志牌', spec: '直径120cm 工程级', unit: '块', price: 1140, source: '1998' },
      { id: 'circle-100-high', name: '圆形反光标志牌', spec: '直径100cm 高强级', unit: '块', price: 1450, source: '1998' },
      { id: 'circle-100-eng', name: '圆形反光标志牌', spec: '直径100cm 工程级', unit: '块', price: 790, source: '1998' },
      { id: 'circle-80-high', name: '圆形反光标志牌', spec: '直径80cm 高强级', unit: '块', price: 930, source: '1998' },
      { id: 'circle-80-eng', name: '圆形反光标志牌', spec: '直径80cm 工程级', unit: '块', price: 505, source: '1998' },
      { id: 'circle-60-high', name: '圆形反光标志牌', spec: '直径60cm 高强级', unit: '块', price: 520, source: '1998' },
      { id: 'circle-60-eng', name: '圆形反光标志牌', spec: '直径60cm 工程级', unit: '块', price: 280, source: '1998' },
      { id: 'rect-reflect-high', name: '正(长)方形反光标志牌', spec: '高强级', unit: '平方米', price: 1450, source: '1998' },
      { id: 'rect-reflect-eng', name: '正(长)方形反光标志牌', spec: '工程级', unit: '平方米', price: 790, source: '1998' },
      { id: 'rect-nonreflect-al', name: '正(长)方形不反光标志牌', spec: '铝板', unit: '平方米', price: 550, source: '1998' },
      { id: 'rect-nonreflect-fe', name: '正(长)方形不反光标志牌', spec: '铁板', unit: '平方米', price: 300, source: '1998' },
      { id: 'alum-sign-2020', name: '铝合金标志牌', spec: '', unit: '平方米', price: 1044, source: '2020' },
      { id: 'alum-plastic-sign', name: '铝塑板标志牌', spec: '', unit: '平方米', price: 844, source: '2020' },
      { id: 'diamond-ref-sign', name: '钻石级反光标志牌', spec: '', unit: '平方米', price: 2600, source: '1999' }
    ]
  },
  {
    id: 'sign-post',
    name: '标志牌支柱及基础',
    items: [
      { id: 'post-single', name: '单柱式标志牌支柱', spec: '', unit: '座', price: 430, source: '1998' },
      { id: 'post-double', name: '双柱式标志牌支柱', spec: '', unit: '组', price: 850, source: '1998' },
      { id: 'post-cant-114', name: '单悬臂式标志牌支柱', spec: 'Ø114mm 4英寸', unit: '座', price: 2810, source: '1998' },
      { id: 'post-cant-140', name: '单悬臂式标志牌支柱', spec: 'Ø140mm 5英寸', unit: '座', price: 3310, source: '1998' },
      { id: 'post-dcant-165', name: '双悬臂式标志牌支柱', spec: 'Ø165mm 6英寸', unit: '座', price: 6890, source: '1998' },
      { id: 'post-dcant-219', name: '双悬臂式标志牌支柱', spec: 'Ø219mm', unit: '座', price: 9560, source: '1998' },
      { id: 'post-dcant-245', name: '双悬臂式标志牌支柱', spec: 'Ø245mm', unit: '座', price: 13570, source: '1998' },
      { id: 'post-gantry', name: '门式(龙门架)标志牌支柱', spec: '按实计算', unit: '座', price: 0, source: '1998' },
      { id: 'steel-sign-parts', name: '标志杆、立柱、法兰钢构件', spec: '', unit: '吨', price: 7967, source: '2020' },
      { id: 'sign-concrete-found', name: '标志牌混凝土基础', spec: '', unit: '立方米', price: 1500, source: '2020' }
    ]
  },
  {
    id: 'warning-guide',
    name: '示警桩与视线诱导',
    items: [
      { id: 'warn-post-89', name: '钢管反光示警桩', spec: 'Ø89mm 3英寸', unit: '根', price: 350, source: 'both' },
      { id: 'warn-post-114', name: '钢管反光示警桩', spec: 'Ø114mm 4英寸', unit: '根', price: 600, source: 'both' },
      { id: 'warn-post-concrete', name: '水泥钢筋砼示警桩、标柱', spec: '', unit: '根', price: 120, source: '1998' },
      { id: 'boundary-post', name: '公路界桩', spec: '', unit: '根', price: 130, source: '1998' },
      { id: 'hm-post', name: '百米桩', spec: '', unit: '根', price: 30, source: '1998' },
      { id: 'hm-sign', name: '百米牌', spec: '', unit: '个', price: 60, source: '2020' },
      { id: 'mile-post', name: '里程碑(水泥砼)', spec: '', unit: '座', price: 406, source: 'both' },
      { id: 'mile-sign', name: '里程牌(单柱式)', spec: '', unit: '个', price: 1500, source: '2020' },
      { id: 'sight-guide', name: '视线诱导标', spec: '', unit: '个', price: 850, source: '2020' },
      { id: 'cone-75-ref', name: '锥形交通路标', spec: '高75cm 反光套', unit: '个', price: 90, source: 'both' },
      { id: 'cone-50-ref', name: '锥形交通路标', spec: '高50cm 反光套', unit: '个', price: 80, source: 'both' },
      { id: 'cone-90-ref', name: '锥形交通路标', spec: '高90cm 反光套', unit: '个', price: 100, source: '2020' },
      { id: 'cone-100-ref-a', name: '锥形交通路标', spec: '高100cm 反光膜 A款', unit: '个', price: 250, source: '1999' },
      { id: 'cone-100-ref-b', name: '锥形交通路标', spec: '高100cm 反光膜 B款', unit: '个', price: 200, source: '1999' },
      { id: 'cone-75-nonref', name: '锥形交通路标', spec: '高75cm 不反光', unit: '个', price: 120, source: '1998' },
      { id: 'cone-50-nonref', name: '锥形交通路标', spec: '高50cm 不反光', unit: '个', price: 85, source: '1998' },
      { id: 'delineator-concrete', name: '轮廓标', spec: '钢筋砼柱式', unit: '根', price: 192, source: 'both' },
      { id: 'delineator-frp', name: '轮廓标', spec: '玻璃钢柱式', unit: '根', price: 217, source: 'both' },
      { id: 'delineator-attach', name: '轮廓标', spec: '附着式', unit: '块', price: 60, source: 'both' }
    ]
  },
  {
    id: 'road-marking',
    name: '路面标线及突起路标',
    items: [
      { id: 'hot-mark', name: '路面标线', spec: '热熔', unit: '平方米', price: 80, source: '1998' },
      { id: 'cold-mark', name: '路面标线', spec: '冷涂', unit: '平方米', price: 40, source: '1998' },
      { id: 'hot-bright-mark', name: '高亮热熔型反光标线', spec: '', unit: '平方米', price: 73, source: '2020' },
      { id: 'hot-vib-mark', name: '高亮热熔型振动标线', spec: '', unit: '平方米', price: 131, source: '2020' },
      { id: 'cold-mark-2020', name: '冷涂标线', spec: '', unit: '平方米', price: 46, source: '2020' },
      { id: 'road-stud', name: '突起路标（道钉）', spec: '', unit: '块', price: 100, source: '1998' },
      { id: 'road-stud-porc', name: '突起路标（瓷标）', spec: '', unit: '块', price: 10, source: '1998' },
      { id: 'road-stud-single', name: '单面反光突起路标', spec: '', unit: '个', price: 38, source: '2020' },
      { id: 'road-stud-double', name: '双面反光突起路标', spec: '', unit: '个', price: 62, source: '2020' }
    ]
  },
  {
    id: 'pavement',
    name: '路面工程',
    items: [
      { id: 'cc-pavement', name: '水泥混凝土路面', spec: '', unit: '平方米', price: 220, source: '1998' },
      { id: 'cc-pavement-30', name: '水泥混凝土路面', spec: '按30cm厚', unit: '平方米', price: 400, source: '2020' },
      { id: 'ac-pavement', name: '沥青路面', spec: '', unit: '平方米', price: 150, source: '1998' },
      { id: 'ac-pavement-mod', name: '改性沥青混凝土路面', spec: '按5+6+8cm厚 两层改性', unit: '平方米', price: 450, source: '2020' },
      { id: 'ac-pavement-std', name: '沥青混凝土路面', spec: '按5+6+8cm厚', unit: '平方米', price: 400, source: '2020' },
      { id: 'epoxy-ac', name: '环氧沥青混凝土路面', spec: '按3cm厚', unit: '平方米', price: 1200, source: '2020' },
      { id: 'sand-pavement', name: '沙土路面', spec: '', unit: '平方米', price: 50, source: '1998' },
      { id: 'soil-shoulder', name: '土质路肩或边坡', spec: '', unit: '平方米', price: 40, source: '1998' },
      { id: 'gravel-shoulder', name: '石渣路肩', spec: '', unit: '平方米', price: 45, source: '1998' },
      { id: 'ac-shoulder', name: '沥青路肩', spec: '', unit: '平方米', price: 275, source: 'both' },
      { id: 'cc-shoulder', name: '水泥路肩', spec: '', unit: '平方米', price: 314, source: 'both' },
      { id: 'curb', name: '路缘石', spec: '水泥砼预制件', unit: '米', price: 75, source: '1998' },
      { id: 'curb-2020', name: '路缘石', spec: '常规尺寸0.15×0.15×1m', unit: '米', price: 70, source: '2020' },
      { id: 'mod-ac-pavement-99', name: '改性沥青砼路面', spec: '', unit: '平方米', price: 380, source: '1999' },
      { id: 'steel-deck-ac', name: '钢桥面行车道改性沥青砼铺装', spec: '', unit: '平方米', price: 2180, source: '1999' },
      { id: 'cc-pavement-highway', name: '水泥混凝土路面', spec: '高速公路专用', unit: '平方米', price: 440, source: '1999' }
    ]
  },
  {
    id: 'subgrade-drain',
    name: '路基与排水防护',
    items: [
      { id: 'roadbed', name: '路基(未筑路面时适用)', spec: '', unit: '立方米', price: 50, source: '1998' },
      { id: 'pipe-jack', name: '顶管穿过公路', spec: '', unit: '米', price: 300, source: '1998' },
      { id: 'stone-ditch', name: '石砌边沟、截水沟', spec: '', unit: '立方米', price: 680, source: 'both' },
      { id: 'soil-ditch', name: '土质边沟、截水沟', spec: '', unit: '米', price: 40, source: '1998' },
      { id: 'precast-ditch', name: '预制铺砌混凝土边沟、截水沟', spec: '', unit: '立方米', price: 1700, source: 'both' },
      { id: 'rc-cover', name: '钢筋混凝土盖板', spec: '', unit: '立方米', price: 2400, source: 'both' },
      { id: 'rc-retain-wall', name: '钢筋混凝土挡土墙', spec: '', unit: '立方米', price: 2400, source: 'both' },
      { id: 'dry-rubble-wall', name: '干砌片石挡土墙、护面墙', spec: '', unit: '立方米', price: 400, source: 'both' },
      { id: 'mortar-rubble-wall', name: '浆砌片石挡土墙、护面墙、护脚', spec: '', unit: '立方米', price: 700, source: 'both' },
      { id: 'soil-slope', name: '土质边坡', spec: '', unit: '立方米', price: 45, source: '2020' },
      { id: 'mortar-slope', name: '浆砌护坡、锥坡', spec: '', unit: '立方米', price: 700, source: 'both' },
      { id: 'spray-plant-slope', name: '喷播草灌护坡', spec: '', unit: '平方米', price: 23, source: '2020' },
      { id: '3d-plant-slope', name: '三维网植被网护坡', spec: '', unit: '平方米', price: 58, source: '2020' }
    ]
  },
  {
    id: 'wave-guardrail',
    name: '波形梁护栏',
    items: [
      { id: 'wave-beam-4m', name: '单面波形钢板', spec: '长4米', unit: '片', price: 670, source: '1998' },
      { id: 'wave-end-beam', name: '端头梁', spec: '长0.74米', unit: '片', price: 200, source: '1998' },
      { id: 'wave-post', name: '立柱(波形梁护栏)', spec: '', unit: '根', price: 480, source: '1998' },
      { id: 'wave-block', name: '防阻块', spec: '', unit: '个', price: 45, source: '1998' },
      { id: 'gr-a-post', name: '单面波形梁钢护栏Gr-A-4E', spec: '立柱', unit: '根', price: 480, source: '2020' },
      { id: 'gr-a-beam', name: '单面波形梁钢护栏Gr-A-4E', spec: '波形板三波板', unit: '米', price: 300, source: '2020' },
      { id: 'gr-sb-post', name: '单面波形梁钢护栏Gr-SB-2E', spec: '立柱', unit: '根', price: 640, source: '2020' },
      { id: 'gr-sb-beam', name: '单面波形梁钢护栏Gr-SB-2E', spec: '波形板三波板', unit: '米', price: 440, source: '2020' },
      { id: 'gr-sa-post', name: '单面波形梁钢护栏Gr-SA-3E', spec: '立柱', unit: '根', price: 950, source: '2020' },
      { id: 'gr-sa-beam', name: '单面波形梁钢护栏Gr-SA-3E', spec: '波形板三波板', unit: '米', price: 380, source: '2020' },
      { id: 'wave-transition', name: '二波与三波护栏过渡板', spec: '', unit: '块', price: 960, source: '2020' }
    ]
  },
  {
    id: 'barrier-fence',
    name: '防撞护栏与隔离设施',
    items: [
      { id: 'rc-barrier', name: '钢筋砼防撞护栏', spec: '', unit: '米', price: 480, source: '1998' },
      { id: 'rc-barrier-new', name: '钢筋混凝土防撞护栏(新建)', spec: '', unit: '米', price: 1800, source: '2020' },
      { id: 'rc-barrier-scrape', name: '钢筋混凝土防撞护栏(刮擦)油漆修补', spec: '', unit: '米', price: 110, source: '2020' },
      { id: 'rc-barrier-repair', name: '钢筋混凝土防撞护栏修补', spec: '', unit: '平方米', price: 300, source: '2020' },
      { id: 'stone-barrier', name: '石砌墙式护栏(示警墩)', spec: '', unit: '立方米', price: 200, source: '1998' },
      { id: 'rubble-barrier', name: '片石砼墙式护栏(示警墩)', spec: '', unit: '立方米', price: 300, source: '1998' },
      { id: 'woven-fence', name: '隔离设施', spec: '编织网', unit: '平方米', price: 180, source: '1998' },
      { id: 'steel-pipe-fence', name: '隔离栅', spec: '钢管、杆焊接式', unit: '平方米', price: 300, source: '1998' },
      { id: 'road-barrier', name: '路栏', spec: '', unit: '平方米', price: 300, source: '1998' },
      { id: 'brick-stone-guard', name: '砖石护栏', spec: '', unit: '平方米', price: 180, source: '1998' },
      { id: 'barbed-wire-post', name: '刺钢丝隔离栅立柱', spec: '电焊钢管', unit: '根', price: 190, source: '2020' },
      { id: 'barbed-wire', name: '刺钢丝隔离栅', spec: '低碳合金钢丝Bw-2.5-102p', unit: '平方米', price: 42, source: '2020' },
      { id: 'weld-fence-post', name: '焊接网隔离栅立柱', spec: 'Φ48', unit: '根', price: 230, source: '2020' },
      { id: 'weld-fence', name: '焊接网隔离栅', spec: '低碳钢丝4.0×150×75', unit: '平方米', price: 100, source: '2020' },
      { id: 'bridge-net-post', name: '桥上防护网立柱', spec: '', unit: '根', price: 130, source: '2020' },
      { id: 'bridge-net', name: '桥上防护网', spec: '焊接网结构、低碳钢丝', unit: '平方米', price: 92, source: '2020' },
      { id: 'glare-net-post', name: '防眩网立柱', spec: 'Φ63', unit: '根', price: 300, source: '2020' },
      { id: 'glare-net', name: '防眩网', spec: '孔径80×32', unit: '平方米', price: 170, source: '2020' },
      { id: 'glare-board', name: '防眩板', spec: '', unit: '块', price: 130, source: '2020' }
    ]
  },
  {
    id: 'bridge-guardrail',
    name: '桥梁护栏及设施',
    items: [
      { id: 'brg-rc-beam', name: '普通钢筋砼梁柱式护栏(桥)', spec: '', unit: '米', price: 345, source: '1998' },
      { id: 'brg-metal-beam', name: '普通金属制梁柱式护栏(桥)', spec: '', unit: '米', price: 891, source: 'both' },
      { id: 'brg-mixed', name: '普通钢筋砼柱、金属混合式护栏(桥)', spec: '', unit: '米', price: 500, source: '1998' },
      { id: 'brg-rc-wall', name: '钢筋砼墙式护栏(桥)', spec: '', unit: '米', price: 1604, source: 'both' },
      { id: 'brg-brick-stone', name: '砖石护栏(桥)', spec: '', unit: '米', price: 459, source: 'both' },
      { id: 'brg-cap', name: '帽石', spec: '', unit: '米', price: 120, source: '1998' },
      { id: 'brg-other', name: '不锈钢护栏、豪华型护栏、其它型式护栏(桥)', spec: '按实计算', unit: '米', price: 0, source: '1998' }
    ]
  },
  {
    id: 'other-traffic',
    name: '其他交安设施',
    items: [
      { id: 'water-horse', name: '水马', spec: '高90cm 长150cm', unit: '个', price: 500, source: '2020' },
      { id: 'isolate-pier', name: '隔离墩', spec: '用于收费站双向岛前后', unit: '个', price: 700, source: '2020' },
      { id: 'flex-post', name: '反光柔性柱', spec: '80×800mm', unit: '根', price: 167, source: '2020' },
      { id: 'crash-bucket', name: '防撞桶', spec: '', unit: '个', price: 900, source: '2020' },
      { id: 'solar-warn-light', name: '太阳能警示灯', spec: '', unit: '个', price: 2632, source: '2020' },
      { id: 'yellow-flash-base', name: '黄闪灯', spec: '带基础', unit: '个', price: 2500, source: '2020' },
      { id: 'yellow-flash-island', name: '黄闪灯', spec: '收费岛头', unit: '个', price: 1000, source: '2020' },
      { id: 'combo-barrier', name: '组合式活动护栏', spec: '', unit: '米', price: 1600, source: '2020' },
      { id: 'high-perf-barrier', name: '高性能活动护栏', spec: '', unit: '米', price: 2800, source: '2020' },
      { id: 'push-pull-barrier', name: '推拉式活动护栏', spec: '', unit: '米', price: 630, source: '2020' },
      { id: 'crash-cushion-ts', name: '可导向防撞垫', spec: 'TS级', unit: '处', price: 30000, source: '2020' },
      { id: 'crash-cushion-ta', name: '可导向防撞垫', spec: 'TA级', unit: '处', price: 20000, source: '2020' },
      { id: 'crash-cushion-tb', name: '可导向防撞垫', spec: 'TB级', unit: '处', price: 17000, source: '2020' }
    ]
  },
  {
    id: 'electromechanical',
    name: '机电设施（拒超及收费系统）',
    items: [
      { id: 'quartz-sensor', name: '石英式称重传感器', spec: '', unit: '套', price: 204300, source: '2020' },
      { id: 'axle-sensor', name: '组轴式称重传感器', spec: '', unit: '套', price: 181070, source: '2020' },
      { id: 'full-weight-sensor', name: '全计重式称重传感器', spec: '', unit: '套', price: 221070, source: '2020' },
      { id: 'weight-controller', name: '称重控制器及机箱', spec: '', unit: '套', price: 15393, source: '2020' },
      { id: 'axle-recognizer', name: '轮轴识别器', spec: '', unit: '套', price: 38360, source: '2020' },
      { id: 'vehicle-recognizer', name: '车型识别仪', spec: '', unit: '套', price: 75068, source: '2020' },
      { id: 'contour-detect', name: '外轮廓检测系统', spec: '', unit: '套', price: 114345, source: '2020' },
      { id: 'grating-separator', name: '光栅车辆分离器', spec: '', unit: '套', price: 14000, source: '2020' },
      { id: 'integrated-camera', name: '一体化摄像机', spec: '带称重板', unit: '套', price: 31000, source: '2020' },
      { id: 'access-cover', name: '检修盖板', spec: '', unit: '个', price: 2000, source: '2020' },
      { id: 'laser-sensor', name: '激光传感器', spec: '', unit: '套', price: 36000, source: '2020' },
      { id: 'weight-ctrl-v2', name: '称重控制器', spec: '', unit: '套', price: 50000, source: '2020' },
      { id: 'barrier-motor', name: '自动栏杆电机', spec: '', unit: '台', price: 10000, source: '2020' },
      { id: 'barrier-controller', name: '自动栏杆主控器', spec: '', unit: '台', price: 8000, source: '2020' },
      { id: 'barrier-housing', name: '自动栏杆箱体外壳', spec: '', unit: '个', price: 5000, source: '2020' },
      { id: 'barrier-bracket', name: '自动栏杆活动支架', spec: '', unit: '个', price: 3000, source: '2020' },
      { id: 'barrier-arm', name: '自动栏杆挡臂', spec: '含ETC栏杆', unit: '根', price: 2761, source: '2020' },
      { id: 'fee-display', name: '费额显示器(LED)', spec: '', unit: '台', price: 9000, source: '2020' },
      { id: 'canopy-light', name: '雨棚信号灯', spec: '', unit: '套', price: 7500, source: '2020' },
      { id: 'comm-light', name: '通信信号灯', spec: '', unit: '套', price: 3871, source: '2020' },
      { id: 'alarm', name: '声光报警器', spec: '', unit: '套', price: 580, source: '2020' },
      { id: 'manual-barrier', name: '手动栏杆', spec: '', unit: '套', price: 3609, source: '2020' },
      { id: 'fog-light', name: '雾灯', spec: '', unit: '套', price: 2202, source: '2020' },
      { id: 'plate-recognition', name: '高清车牌识别系统', spec: '', unit: '套', price: 10000, source: '2020' },
      { id: 'lane-controller', name: '车道控制器', spec: '', unit: '套', price: 16000, source: '2020' },
      { id: 'lane-camera', name: '收费车道摄像机', spec: '', unit: '套', price: 7000, source: '2020' },
      { id: 'booth-camera', name: '收费亭内摄像机', spec: '', unit: '套', price: 5786, source: '2020' },
      { id: 'plaza-distributor', name: '收费广场配电箱', spec: '', unit: '台', price: 5206, source: '2020' },
      { id: 'plaza-cabinet', name: '广场设备机柜', spec: '', unit: '台', price: 4133, source: '2020' },
      { id: 'plaza-camera', name: '收费广场摄像机', spec: '', unit: '套', price: 9000, source: '2020' },
      { id: 'lane-led', name: '车道雨棚LED屏', spec: '', unit: '套', price: 10990, source: '2020' },
      { id: 'rsu-antenna', name: 'RSU天线', spec: '', unit: '台', price: 13400, source: '2020' },
      { id: 'rsu-controller', name: 'RSU天线控制器', spec: '', unit: '套', price: 1600, source: '2020' },
      { id: 'rsu-post', name: 'RSU天线立柱', spec: '', unit: '套', price: 6630, source: '2020' },
      { id: 'rsu-hanger', name: 'RSU天线悬挂设备', spec: '', unit: '套', price: 2000, source: '2020' },
      { id: 'anti-rush', name: '车道防闯岗机', spec: '', unit: '套', price: 26800, source: '2020' },
      { id: 'mobile-pay', name: '移动支付受理终端', spec: '', unit: '套', price: 7100, source: '2020' },
      { id: 'post-single-crash', name: '单向收费亭防撞柱', spec: '', unit: '套', price: 15000, source: '2020' },
      { id: 'post-double-crash', name: '双向收费亭防撞柱', spec: '', unit: '套', price: 16000, source: '2020' },
      { id: 'height-limit', name: '车道限高架', spec: '含基础、防雷、暗埋、钢架等', unit: '套', price: 32000, source: '2020' }
    ]
  },
  {
    id: 'etc-gantry',
    name: 'ETC门架及防雷通信系统',
    items: [
      { id: 'etc-gantry-2', name: 'ETC门架钢结构', spec: '2+1', unit: '套', price: 160000, source: '2020' },
      { id: 'etc-gantry-3', name: 'ETC门架钢结构', spec: '3+1', unit: '套', price: 190000, source: '2020' },
      { id: 'etc-gantry-4', name: 'ETC门架钢结构', spec: '4+1', unit: '套', price: 220000, source: '2020' },
      { id: 'etc-gantry-5', name: 'ETC门架钢结构', spec: '5+1', unit: '套', price: 273549, source: '2020' },
      { id: 'etc-gantry-6', name: 'ETC门架钢结构', spec: '6+1', unit: '套', price: 296345, source: '2020' },
      { id: 'etc-rsu', name: 'RSU天线(门架)', spec: '', unit: '套', price: 32000, source: '2020' },
      { id: 'etc-rsu-ctrl', name: 'RSU控制器', spec: '', unit: '套', price: 5000, source: '2020' },
      { id: 'plate-img', name: '车牌图像识别设备', spec: '', unit: '套', price: 8000, source: '2020' },
      { id: 'ir-light', name: '红外补光灯', spec: '', unit: '套', price: 1500, source: '2020' },
      { id: 'etc-lane-ctrl', name: '车道控制器(门架)', spec: '', unit: '套', price: 25720, source: '2020' },
      { id: 'monitor-ctrl', name: '设备监控控制器', spec: '', unit: '套', price: 20394, source: '2020' },
      { id: 'ups-3kva', name: 'UPS 3KVA/8h', spec: '', unit: '套', price: 42000, source: '2020' },
      { id: 'secure-gateway', name: '安全网关', spec: '', unit: '套', price: 41182, source: '2020' },
      { id: 'outdoor-cabinet', name: '室外机柜(门架)', spec: '', unit: '台', price: 50633, source: '2020' },
      { id: 'power-module', name: '配电模块', spec: '', unit: '套', price: 5267, source: '2020' },
      { id: 'ac-unit', name: '空调', spec: '', unit: '套', price: 5000, source: '2020' },
      { id: 'door-access', name: '电子门禁', spec: '', unit: '套', price: 15184, source: '2020' },
      { id: 'cabinet-camera', name: '柜外视频监控', spec: '', unit: '套', price: 8147, source: '2020' },
      { id: 'pano-camera', name: '全景摄像机', spec: '', unit: '套', price: 10000, source: '2020' },
      { id: 'etc-ups', name: 'ETC门架UPS', spec: '', unit: '套', price: 80000, source: '2020' },
      { id: 'spd-c1', name: 'C级单相电源防雷器', spec: '', unit: '套', price: 1381, source: '2020' },
      { id: 'spd-bc3', name: 'BC级三相复合型电源防雷器', spec: '', unit: '套', price: 5131, source: '2020' },
      { id: 'spd-net', name: '网络信号防雷器', spec: '', unit: '套', price: 581, source: '2020' },
      { id: 'spd-monitor', name: '防雷监测终端', spec: '', unit: '套', price: 5800, source: '2020' },
      { id: 'spd-smart-bc3', name: 'SPD智能防雷监测终端', spec: 'BC级三相', unit: '套', price: 7959, source: '2020' },
      { id: 'fiber-48', name: '通信光缆', spec: '48芯', unit: '米', price: 25, source: '2020' },
      { id: 'fiber-38', name: '通信光缆', spec: '38芯', unit: '米', price: 19, source: '2020' },
      { id: 'fiber-28', name: '通信光缆', spec: '28芯', unit: '米', price: 17, source: '2020' },
      { id: 'fiber-4', name: '通信光缆', spec: '4芯', unit: '米', price: 12, source: '2020' },
      { id: 'fiber-box-48', name: '光缆接续盒', spec: '48D', unit: '套', price: 2800, source: '2020' },
      { id: 'cant-info-board', name: '悬臂式信息标志板', spec: '', unit: '套', price: 227565, source: '2020' },
      { id: 'gantry-info-board', name: '门架式信息标志板', spec: '', unit: '套', price: 360000, source: '2020' }
    ]
  },
  {
    id: 'noise-green',
    name: '声屏障与公路绿化',
    items: [
      { id: 'noise-barrier', name: '声屏障', spec: '综合价格含立柱基础板面', unit: '平方米', price: 1200, source: '2020' },
      { id: 'glass-screen', name: '隔音墙钢化夹胶玻璃屏', spec: '1970mm×1350mm', unit: '块', price: 1500, source: '2020' },
      { id: 'noise-post', name: '声屏障立柱', spec: '', unit: '根', price: 1500, source: '2020' },
      { id: 'noise-skirt', name: '声屏障裙边', spec: '', unit: 'kg', price: 23, source: '2020' },
      { id: 'noise-foundation', name: '声屏障基础', spec: '', unit: '米', price: 800, source: '2020' },
      { id: 'tree-3under', name: '普通乔木', spec: '胸径3cm及以下', unit: '株', price: 40, source: '1998' },
      { id: 'tree-3-10-1998', name: '普通乔木', spec: '胸径3cm~10cm', unit: '株', price: 120, source: '1998' },
      { id: 'tree-3-10', name: '普通乔木', spec: '胸径3cm~10cm', unit: '株', price: 560, source: '2020' },
      { id: 'tree-5under', name: '乔木', spec: '胸径5cm及以下', unit: '株', price: 575, source: '2020' },
      { id: 'tree-6-10', name: '乔木', spec: '胸径6cm~10cm', unit: '株', price: 933, source: '2020' },
      { id: 'tree-11-20', name: '乔木', spec: '胸径11cm~20cm', unit: '株', price: 1943, source: '2020' },
      { id: 'tree-21-30', name: '乔木', spec: '胸径21cm~30cm', unit: '株', price: 2985, source: '2020' },
      { id: 'tree-31-40', name: '乔木', spec: '胸径31cm~40cm', unit: '株', price: 4129, source: '2020' },
      { id: 'tree-41-50', name: '乔木', spec: '胸径41cm~50cm', unit: '株', price: 4878, source: '2020' },
      { id: 'tree-51-60', name: '乔木', spec: '胸径51cm~60cm', unit: '株', price: 5498, source: '2020' },
      { id: 'tree-61-70', name: '乔木', spec: '胸径61cm~70cm', unit: '株', price: 6009, source: '2020' },
      { id: 'lawn-1998', name: '普通人工草坪', spec: '', unit: '平方米', price: 80, source: '1998' },
      { id: 'lawn-2020', name: '普通人工草坪', spec: '', unit: '平方米', price: 40, source: '2020' },
      { id: 'shrub-1998', name: '普通灌木', spec: '', unit: '平方米', price: 150, source: '1998' },
      { id: 'shrub-80-60', name: '普通灌木', spec: '苗高×冠幅 80×60', unit: '丛', price: 117, source: '2020' },
      { id: 'shrub-100-80', name: '普通灌木', spec: '苗高×冠幅 100×80', unit: '丛', price: 196, source: '2020' },
      { id: 'shrub-120-100', name: '普通灌木', spec: '苗高×冠幅 120×100', unit: '丛', price: 334, source: '2020' },
      { id: 'shrub-150-120', name: '普通灌木', spec: '苗高×冠幅 150×120', unit: '丛', price: 438, source: '2020' },
      { id: 'shrub-100-60', name: '普通灌木', spec: '苗高×冠幅 100×60', unit: '株', price: 174, source: '2020' },
      { id: 'shrub-120-80', name: '普通灌木', spec: '苗高×冠幅 120×80', unit: '株', price: 229, source: '2020' },
      { id: 'shrub-150-100', name: '普通灌木', spec: '苗高×冠幅 150×100', unit: '株', price: 335, source: '2020' },
      { id: 'shrub-200-150', name: '普通灌木', spec: '苗高×冠幅 200×150', unit: '株', price: 508, source: '2020' },
      { id: 'seasonal-flower', name: '时花', spec: '', unit: '平方米', price: 120, source: '2020' },
      { id: 'flower-rare', name: '花卉、名贵树木、名贵草皮', spec: '按实计算', unit: '', price: 0, source: '1998' }
    ]
  },
  {
    id: 'charger',
    name: '充电桩设施',
    items: [
      { id: 'charger-120kw', name: '120kW一体双枪直流快充充电桩', spec: '', unit: '台', price: 150000, source: '2020' },
      { id: 'charger-canopy', name: '充电站雨棚', spec: '钢结构', unit: '座', price: 100000, source: '2020' },
      { id: 'charger-lightbox', name: '充电站广告灯箱', spec: '', unit: '座', price: 20000, source: '2020' }
    ]
  },
  {
    id: 'other-damage',
    name: '其他公路损害',
    items: [
      { id: 'cargo-touch', name: '车辆载运货物触地', spec: '', unit: '米', price: 2, source: '1998' },
      { id: 'tracked-vehicle', name: '履带、铁轮车辆行驶公路', spec: '按实计算（相应路面标准10%~100%）', unit: '平方米', price: 0, source: '1998' },
      { id: 'force-on-unfinished', name: '车辆强行在未完工或养生期水泥路面上行驶', spec: '按实计算', unit: '平方米', price: 0, source: '1998' },
      { id: 'clog-ditch', name: '填塞水沟', spec: '', unit: '米', price: 15, source: '1998' },
      { id: 'pollute-mud', name: '污染公路（沙、石、泥土、垃圾）', spec: '', unit: '平方米', price: 72, source: 'both' },
      { id: 'pollute-oil-cc', name: '油类、酸、碱类化学物质污染水泥路面', spec: '', unit: '平方米', price: 318, source: 'both' },
      { id: 'pollute-oil-ac', name: '油类、酸、碱类化学物质污染沥青路面', spec: '', unit: '平方米', price: 246, source: 'both' },
      { id: 'pollute-oil-mod', name: '油类、酸、碱类化学物质污染改性沥青路面', spec: '', unit: '平方米', price: 275, source: '2020' },
      { id: 'pollute-mod-ac-99', name: '油类品、化学物品污染改性沥青砼路面', spec: '', unit: '平方米', price: 350, source: '1999' },
      { id: 'pollute-cc-highway', name: '油类品、化学物品污染水泥砼路面', spec: '高速公路专用', unit: '平方米', price: 80, source: '1999' },
      { id: 'pollute-other', name: '其他物质污染路面', spec: '', unit: '平方米', price: 72, source: 'both' },
      { id: 'other-facility', name: '桥梁、涵洞、隧道、渡口、码头及其他设施', spec: '按实计算', unit: '', price: 0, source: '1998' },
      { id: 'maintenance-house', name: '道班房', spec: '按实计算', unit: '', price: 0, source: '1998' },
      { id: 'toll-station', name: '收费站设施', spec: '按实计算', unit: '', price: 0, source: '1998' },
      { id: 'power-pole', name: '电杆及照明设备', spec: '按实计算', unit: '', price: 0, source: '1998' }
    ]
  }
]

// ---- 按来源分组的原始数据（供标准页只读浏览） ----
var standards = [
  {
    id: '1998',
    name: '损坏公路路产赔偿标准',
    docCode: '粤交路〔1998〕38号',
    categories: [
      {
        id: 's1998-signage',
        name: '标志牌',
        items: [
          { name: '三角形反光标志牌', spec: '边长130cm 高强级', unit: '块', price: 2120 },
          { name: '三角形反光标志牌', spec: '边长130cm 工程级', unit: '块', price: 1150 },
          { name: '三角形反光标志牌', spec: '边长110cm 高强级', unit: '块', price: 1520 },
          { name: '三角形反光标志牌', spec: '边长110cm 工程级', unit: '块', price: 830 },
          { name: '三角形反光标志牌', spec: '边长90cm 高强级', unit: '块', price: 1015 },
          { name: '三角形反光标志牌', spec: '边长90cm 工程级', unit: '块', price: 550 },
          { name: '三角形反光标志牌', spec: '边长70cm 高强级', unit: '块', price: 610 },
          { name: '三角形反光标志牌', spec: '边长70cm 工程级', unit: '块', price: 330 },
          { name: '圆形反光标志牌', spec: '直径120cm 高强级', unit: '块', price: 2090 },
          { name: '圆形反光标志牌', spec: '直径120cm 工程级', unit: '块', price: 1140 },
          { name: '圆形反光标志牌', spec: '直径100cm 高强级', unit: '块', price: 1450 },
          { name: '圆形反光标志牌', spec: '直径100cm 工程级', unit: '块', price: 790 },
          { name: '圆形反光标志牌', spec: '直径80cm 高强级', unit: '块', price: 930 },
          { name: '圆形反光标志牌', spec: '直径80cm 工程级', unit: '块', price: 505 },
          { name: '圆形反光标志牌', spec: '直径60cm 高强级', unit: '块', price: 520 },
          { name: '圆形反光标志牌', spec: '直径60cm 工程级', unit: '块', price: 280 },
          { name: '正(长)方形反光标志牌', spec: '高强级', unit: '平方米', price: 1450 },
          { name: '正(长)方形反光标志牌', spec: '工程级', unit: '平方米', price: 790 },
          { name: '正(长)方形不反光标志牌', spec: '铝板', unit: '平方米', price: 550 },
          { name: '正(长)方形不反光标志牌', spec: '铁板', unit: '平方米', price: 300 }
        ]
      },
      {
        id: 's1998-signpost',
        name: '标志牌支柱',
        items: [
          { name: '单柱式标志牌支柱', spec: '', unit: '座', price: 430 },
          { name: '双柱式标志牌支柱', spec: '', unit: '组', price: 850 },
          { name: '单悬臂式标志牌支柱', spec: 'Ø114mm 4英寸', unit: '座', price: 2810 },
          { name: '单悬臂式标志牌支柱', spec: 'Ø140mm 5英寸', unit: '座', price: 3310 },
          { name: '双悬臂式标志牌支柱', spec: 'Ø165mm 6英寸', unit: '座', price: 6890 },
          { name: '双悬臂式标志牌支柱', spec: 'Ø219mm', unit: '座', price: 9560 },
          { name: '双悬臂式标志牌支柱', spec: 'Ø245mm', unit: '座', price: 13570 },
          { name: '门式(龙门架)标志牌支柱', spec: '按实计算', unit: '座', price: 0 }
        ]
      },
      {
        id: 's1998-other-sign',
        name: '其它标志与设施',
        items: [
          { name: '钢管反光示警桩', spec: 'Ø89mm 3英寸', unit: '根', price: 300 },
          { name: '钢管反光示警桩', spec: 'Ø114mm 4英寸', unit: '根', price: 350 },
          { name: '水泥钢筋砼示警桩、标柱', spec: '', unit: '根', price: 120 },
          { name: '公路界桩', spec: '', unit: '根', price: 130 },
          { name: '百米桩', spec: '', unit: '根', price: 30 },
          { name: '里程碑(水泥砼)', spec: '', unit: '座', price: 280 },
          { name: '锥形交通路标', spec: '高75cm 反光套', unit: '个', price: 140 },
          { name: '锥形交通路标', spec: '高50cm 反光套', unit: '个', price: 105 },
          { name: '锥形交通路标', spec: '高75cm 不反光', unit: '个', price: 120 },
          { name: '锥形交通路标', spec: '高50cm 不反光', unit: '个', price: 85 },
          { name: '轮廓标', spec: '钢筋砼柱式', unit: '根', price: 100 },
          { name: '轮廓标', spec: '玻璃钢柱式', unit: '根', price: 200 },
          { name: '轮廓标', spec: '附着式', unit: '块', price: 55 },
          { name: '路面标线', spec: '热熔', unit: '平方米', price: 80 },
          { name: '路面标线', spec: '冷涂', unit: '平方米', price: 40 },
          { name: '突起路标(道钉)', spec: '', unit: '块', price: 100 },
          { name: '突起路标(瓷标)', spec: '', unit: '块', price: 10 }
        ]
      },
      {
        id: 's1998-pavement',
        name: '路面、路基',
        items: [
          { name: '水泥混凝土路面', spec: '', unit: '平方米', price: 220 },
          { name: '沥青路面', spec: '', unit: '平方米', price: 150 },
          { name: '沙土路面', spec: '', unit: '平方米', price: 50 },
          { name: '土质路肩或边坡', spec: '', unit: '平方米', price: 40 },
          { name: '浆砌护坡、锥坡', spec: '', unit: '平方米', price: 85 },
          { name: '石渣路肩', spec: '', unit: '平方米', price: 45 },
          { name: '沥青路肩', spec: '', unit: '平方米', price: 100 },
          { name: '水泥路肩', spec: '', unit: '平方米', price: 150 },
          { name: '路基(未筑路面时适用)', spec: '', unit: '立方米', price: 50 },
          { name: '顶管穿过公路', spec: '', unit: '米', price: 300 }
        ]
      },
      {
        id: 's1998-drain',
        name: '排水沟、挡土墙',
        items: [
          { name: '石砌边沟、截水沟', spec: '', unit: '米', price: 180 },
          { name: '土质边沟、截水沟', spec: '', unit: '米', price: 40 },
          { name: '砼预制件铺砌边沟、截水沟', spec: '', unit: '米', price: 200 },
          { name: '水泥钢筋砼盖板', spec: '', unit: '平方米', price: 200 },
          { name: '水泥钢筋砼挡土墙', spec: '', unit: '立方米', price: 700 },
          { name: '干砌片石挡土墙、护面墙', spec: '', unit: '立方米', price: 150 },
          { name: '浆砌片石挡土墙、护面墙、护脚', spec: '', unit: '立方米', price: 200 },
          { name: '路缘石(水泥砼预制件)', spec: '', unit: '米', price: 75 }
        ]
      },
      {
        id: 's1998-traffic-safety',
        name: '交通安全设施',
        items: [
          { name: '单面波形钢板', spec: '长4米', unit: '片', price: 670 },
          { name: '端头梁', spec: '长0.74米', unit: '片', price: 200 },
          { name: '立柱(波形梁护栏)', spec: '', unit: '根', price: 480 },
          { name: '防阻块', spec: '', unit: '个', price: 45 },
          { name: '钢筋砼防撞护栏', spec: '', unit: '米', price: 480 },
          { name: '石砌墙式护栏(示警墩)', spec: '', unit: '立方米', price: 200 },
          { name: '片石砼墙式护栏(示警墩)', spec: '', unit: '立方米', price: 300 },
          { name: '隔离设施(编织网)', spec: '', unit: '平方米', price: 180 },
          { name: '隔离栅(钢管、杆焊接式)', spec: '', unit: '平方米', price: 300 },
          { name: '路栏', spec: '', unit: '平方米', price: 300 },
          { name: '砖石护栏', spec: '', unit: '平方米', price: 180 }
        ]
      },
      {
        id: 's1998-bridge-green',
        name: '桥护栏与绿化',
        items: [
          { name: '普通钢筋砼梁柱式护栏', spec: '', unit: '米', price: 345 },
          { name: '普通金属制梁柱式护栏', spec: '', unit: '米', price: 450 },
          { name: '普通钢筋砼柱、金属混合式护栏', spec: '', unit: '米', price: 500 },
          { name: '钢筋砼墙式护栏(桥)', spec: '', unit: '米', price: 480 },
          { name: '砖石护栏(桥)', spec: '', unit: '平方米', price: 200 },
          { name: '不锈钢护栏、豪华型护栏、其它型式护栏', spec: '按实计算', unit: '米', price: 0 },
          { name: '帽石', spec: '', unit: '米', price: 120 },
          { name: '普通乔木', spec: '胸径3cm及以下', unit: '株', price: 40 },
          { name: '普通乔木', spec: '胸径3cm~10cm', unit: '株', price: 120 },
          { name: '普通人工草坪', spec: '', unit: '平方米', price: 80 },
          { name: '普通灌木', spec: '', unit: '平方米', price: 150 },
          { name: '花卉、名贵树木、名贵草皮', spec: '按实计算', unit: '', price: 0 }
        ]
      },
      {
        id: 's1998-other',
        name: '其它公路损害与设施',
        items: [
          { name: '车辆载运货物触地', spec: '', unit: '米', price: 2 },
          { name: '履带、铁轮车辆行驶公路', spec: '按实计算', unit: '平方米', price: 0 },
          { name: '车辆强行在未完工或养生期水泥路面上行驶', spec: '按实计算', unit: '平方米', price: 0 },
          { name: '填塞水沟', spec: '', unit: '米', price: 15 },
          { name: '污染公路（沙、石、泥土、垃圾）', spec: '', unit: '平方米', price: 5 },
          { name: '污染公路（油类品、化学物品-水泥路面）', spec: '', unit: '平方米', price: 60 },
          { name: '污染公路（油类品、化学物品-沥青路面）', spec: '', unit: '平方米', price: 120 },
          { name: '污染公路（其它物品）', spec: '', unit: '平方米', price: 5 },
          { name: '桥梁、涵洞、隧道、渡口、码头及其他设施', spec: '按实计算', unit: '', price: 0 },
          { name: '道班房', spec: '按实计算', unit: '', price: 0 },
          { name: '收费站设施', spec: '按实计算', unit: '', price: 0 },
          { name: '电杆及照明设备', spec: '按实计算', unit: '', price: 0 }
        ]
      }
    ]
  },
  {
    id: '1999',
    name: '增补公路路产赔偿项目标准',
    docCode: '粤交路〔1999〕263号',
    categories: [
      {
        id: 's1999-sign',
        name: '标志牌与锥形路标',
        items: [
          { name: '钻石级反光标志牌', spec: '', unit: '平方米', price: 2600 },
          { name: '锥形交通路标', spec: '高100cm 反光膜 A款', unit: '个', price: 250 },
          { name: '锥形交通路标', spec: '高100cm 反光膜 B款', unit: '个', price: 200 }
        ]
      },
      {
        id: 's1999-pavement',
        name: '路面工程（高速公路专用）',
        items: [
          { name: '改性沥青砼路面', spec: '', unit: '平方米', price: 380 },
          { name: '钢桥面行车道改性沥青砼铺装', spec: '', unit: '平方米', price: 2180 },
          { name: '油类品、化学物品污染改性沥青砼路面', spec: '', unit: '平方米', price: 350 },
          { name: '水泥混凝土路面', spec: '高速公路专用', unit: '平方米', price: 440 },
          { name: '油类品、化学物品污染水泥砼路面', spec: '高速公路专用', unit: '平方米', price: 80 }
        ]
      }
    ]
  },
  {
    id: '2020',
    name: '广东省损坏公路路产赔偿指导标准',
    docCode: '粤公路函〔2020〕352号',
    categories: [
      {
        id: 's2020-drain',
        name: '排水与路基防护加固工程',
        items: [
          { name: '石砌边沟、截水沟', spec: '', unit: '立方米', price: 680 },
          { name: '预制铺砌混凝土边沟、截水沟', spec: '', unit: '立方米', price: 1700 },
          { name: '钢筋混凝土盖板', spec: '', unit: '立方米', price: 2400 },
          { name: '钢筋混凝土挡土墙', spec: '', unit: '立方米', price: 2400 },
          { name: '干砌片石挡土墙、护面墙', spec: '', unit: '立方米', price: 400 },
          { name: '浆砌片石挡土墙、护面墙、护脚', spec: '', unit: '立方米', price: 700 },
          { name: '土质边坡', spec: '', unit: '立方米', price: 45 },
          { name: '浆砌护坡、锥坡', spec: '', unit: '立方米', price: 700 },
          { name: '喷播草灌护坡', spec: '', unit: '平方米', price: 23 },
          { name: '三维网植被网护坡', spec: '', unit: '平方米', price: 58 }
        ]
      },
      {
        id: 's2020-pavement',
        name: '路面工程',
        items: [
          { name: '水泥混凝土路面', spec: '按30cm厚', unit: '平方米', price: 400 },
          { name: '改性沥青混凝土路面', spec: '按5+6+8cm厚 两层改性', unit: '平方米', price: 450 },
          { name: '沥青混凝土路面', spec: '按5+6+8cm厚', unit: '平方米', price: 400 },
          { name: '环氧沥青混凝土路面', spec: '按3cm厚', unit: '平方米', price: 1200 },
          { name: '沥青路肩', spec: '', unit: '平方米', price: 275 },
          { name: '水泥路肩', spec: '', unit: '平方米', price: 314 },
          { name: '油类、酸、碱类化学物质污染水泥路面', spec: '', unit: '平方米', price: 318 },
          { name: '油类、酸、碱类化学物质污染沥青路面', spec: '', unit: '平方米', price: 246 },
          { name: '油类、酸、碱类化学物质污染改性沥青路面', spec: '', unit: '平方米', price: 275 },
          { name: '其他物质污染路面', spec: '', unit: '平方米', price: 72 },
          { name: '路缘石', spec: '常规尺寸0.15×0.15×1m', unit: '米', price: 70 }
        ]
      },
      {
        id: 's2020-bridge-safety',
        name: '桥梁涵洞工程与交通安全设施',
        items: [
          { name: '普通金属制梁柱式护栏', spec: '', unit: '米', price: 891 },
          { name: '钢筋混凝土墙式护栏(桥)', spec: '', unit: '米', price: 1604 },
          { name: '砖石护栏(桥)', spec: '', unit: '米', price: 459 },
          { name: '钢筋混凝土防撞护栏(新建)', spec: '', unit: '米', price: 1800 },
          { name: '钢筋混凝土防撞护栏(刮擦)油漆修补', spec: '', unit: '米', price: 110 },
          { name: '钢筋混凝土防撞护栏修补', spec: '', unit: '平方米', price: 300 },
          { name: '刺钢丝隔离栅立柱(电焊钢管)', spec: '', unit: '根', price: 190 },
          { name: '刺钢丝隔离栅(低碳合金钢丝Bw-2.5-102p)', spec: '', unit: '平方米', price: 42 },
          { name: '焊接网隔离栅立柱(Φ48)', spec: '', unit: '根', price: 230 },
          { name: '焊接网隔离栅(低碳钢丝4.0×150×75)', spec: '', unit: '平方米', price: 100 },
          { name: '桥上防护网立柱', spec: '', unit: '根', price: 130 },
          { name: '桥上防护网(焊接网结构、低碳钢丝)', spec: '', unit: '平方米', price: 92 },
          { name: '防眩网立柱(Φ63)', spec: '', unit: '根', price: 300 },
          { name: '防眩网(孔径80×32)', spec: '', unit: '平方米', price: 170 },
          { name: '防眩板', spec: '', unit: '块', price: 130 }
        ]
      },
      {
        id: 's2020-sign-marking',
        name: '标志、标线与波形护栏',
        items: [
          { name: '铝合金标志牌', spec: '', unit: '平方米', price: 1044 },
          { name: '铝塑板标志牌', spec: '', unit: '平方米', price: 844 },
          { name: '标志杆、立柱、法兰钢构件', spec: '', unit: '吨', price: 7967 },
          { name: '标志牌混凝土基础', spec: '', unit: '立方米', price: 1500 },
          { name: '钢管反光示警桩', spec: '89mm', unit: '根', price: 350 },
          { name: '钢管反光示警桩', spec: '114mm', unit: '根', price: 600 },
          { name: '里程碑(水泥砼)', spec: '', unit: '座', price: 406 },
          { name: '里程牌(单柱式)', spec: '', unit: '个', price: 1500 },
          { name: '百米牌', spec: '', unit: '个', price: 60 },
          { name: '视线诱导标', spec: '', unit: '个', price: 850 },
          { name: '锥形交通路标', spec: '高75cm 带反光套', unit: '个', price: 90 },
          { name: '锥形交通路标', spec: '高50cm 带反光套', unit: '个', price: 80 },
          { name: '锥形交通路标', spec: '高90cm 带反光套', unit: '个', price: 100 },
          { name: '轮廓标', spec: '钢筋混凝土柱式', unit: '根', price: 192 },
          { name: '轮廓标', spec: '玻璃钢柱式', unit: '根', price: 217 },
          { name: '轮廓标', spec: '附着式', unit: '块', price: 60 },
          { name: '高亮热熔型反光标线', spec: '', unit: '平方米', price: 73 },
          { name: '高亮热熔型振动标线', spec: '', unit: '平方米', price: 131 },
          { name: '冷涂标线', spec: '', unit: '平方米', price: 46 },
          { name: '单面反光突起路标', spec: '', unit: '个', price: 38 },
          { name: '双面反光突起路标', spec: '', unit: '个', price: 62 },
          { name: '单面波形梁钢护栏Gr-A-4E(立柱)', spec: '', unit: '根', price: 480 },
          { name: '单面波形梁钢护栏Gr-A-4E(波形板三波板)', spec: '', unit: '米', price: 300 },
          { name: '单面波形梁钢护栏Gr-SB-2E(立柱)', spec: '', unit: '根', price: 640 },
          { name: '单面波形梁钢护栏Gr-SB-2E(波形板三波板)', spec: '', unit: '米', price: 440 },
          { name: '单面波形梁钢护栏Gr-SA-3E(立柱)', spec: '', unit: '根', price: 950 },
          { name: '单面波形梁钢护栏Gr-SA-3E(波形板三波板)', spec: '', unit: '米', price: 380 },
          { name: '二波与三波护栏过渡板', spec: '', unit: '块', price: 960 }
        ]
      },
      {
        id: 's2020-other-safety',
        name: '其他交安设施',
        items: [
          { name: '水马', spec: '高90cm 长150cm', unit: '个', price: 500 },
          { name: '隔离墩', spec: '用于收费站双向岛前后', unit: '个', price: 700 },
          { name: '反光柔性柱', spec: '80×800mm', unit: '根', price: 167 },
          { name: '防撞桶', spec: '', unit: '个', price: 900 },
          { name: '太阳能警示灯', spec: '', unit: '个', price: 2632 },
          { name: '黄闪灯(带基础)', spec: '', unit: '个', price: 2500 },
          { name: '黄闪灯(收费岛头)', spec: '', unit: '个', price: 1000 },
          { name: '组合式活动护栏', spec: '', unit: '米', price: 1600 },
          { name: '高性能活动护栏', spec: '', unit: '米', price: 2800 },
          { name: '推拉式活动护栏', spec: '', unit: '米', price: 630 },
          { name: '可导向防撞垫 TS级', spec: '', unit: '处', price: 30000 },
          { name: '可导向防撞垫 TA级', spec: '', unit: '处', price: 20000 },
          { name: '可导向防撞垫 TB级', spec: '', unit: '处', price: 17000 }
        ]
      },
      {
        id: 's2020-mechanical',
        name: '机电设施（拒超及收费系统）',
        items: [
          { name: '石英式称重传感器', spec: '', unit: '套', price: 204300 },
          { name: '组轴式称重传感器', spec: '', unit: '套', price: 181070 },
          { name: '全计重式称重传感器', spec: '', unit: '套', price: 221070 },
          { name: '称重控制器及机箱', spec: '', unit: '套', price: 15393 },
          { name: '轮轴识别器', spec: '', unit: '套', price: 38360 },
          { name: '车型识别仪', spec: '', unit: '套', price: 75068 },
          { name: '外轮廓检测系统', spec: '', unit: '套', price: 114345 },
          { name: '光栅车辆分离器', spec: '', unit: '套', price: 14000 },
          { name: '一体化摄像机(带称重板)', spec: '', unit: '套', price: 31000 },
          { name: '检修盖板', spec: '', unit: '个', price: 2000 },
          { name: '激光传感器', spec: '', unit: '套', price: 36000 },
          { name: '称重控制器', spec: '', unit: '套', price: 50000 },
          { name: '自动栏杆电机', spec: '', unit: '台', price: 10000 },
          { name: '自动栏杆主控器', spec: '', unit: '台', price: 8000 },
          { name: '自动栏杆箱体外壳', spec: '', unit: '个', price: 5000 },
          { name: '自动栏杆活动支架', spec: '', unit: '个', price: 3000 },
          { name: '自动栏杆挡臂(含ETC栏杆)', spec: '', unit: '根', price: 2761 },
          { name: '费额显示器(LED)', spec: '', unit: '台', price: 9000 },
          { name: '雨棚信号灯', spec: '', unit: '套', price: 7500 },
          { name: '通信信号灯', spec: '', unit: '套', price: 3871 },
          { name: '声光报警器', spec: '', unit: '套', price: 580 },
          { name: '手动栏杆', spec: '', unit: '套', price: 3609 },
          { name: '雾灯', spec: '', unit: '套', price: 2202 },
          { name: '高清车牌识别系统', spec: '', unit: '套', price: 10000 },
          { name: '车道控制器', spec: '', unit: '套', price: 16000 },
          { name: '收费车道摄像机', spec: '', unit: '套', price: 7000 },
          { name: '收费亭内摄像机', spec: '', unit: '套', price: 5786 },
          { name: '收费广场配电箱', spec: '', unit: '台', price: 5206 },
          { name: '广场设备机柜', spec: '', unit: '台', price: 4133 },
          { name: '收费广场摄像机', spec: '', unit: '套', price: 9000 },
          { name: '车道雨棚LED屏', spec: '', unit: '套', price: 10990 },
          { name: 'RSU天线', spec: '', unit: '台', price: 13400 },
          { name: 'RSU天线控制器', spec: '', unit: '套', price: 1600 },
          { name: 'RSU天线立柱', spec: '', unit: '套', price: 6630 },
          { name: 'RSU天线悬挂设备', spec: '', unit: '套', price: 2000 },
          { name: '车道防闯岗机', spec: '', unit: '套', price: 26800 },
          { name: '移动支付受理终端', spec: '', unit: '套', price: 7100 },
          { name: '单向收费亭防撞柱', spec: '', unit: '套', price: 15000 },
          { name: '双向收费亭防撞柱', spec: '', unit: '套', price: 16000 },
          { name: '车道限高架', spec: '含基础、防雷、暗埋、钢架等', unit: '套', price: 32000 }
        ]
      },
      {
        id: 's2020-etc',
        name: 'ETC门架及防雷通信系统',
        items: [
          { name: 'ETC门架钢结构(2+1)', spec: '', unit: '套', price: 160000 },
          { name: 'ETC门架钢结构(3+1)', spec: '', unit: '套', price: 190000 },
          { name: 'ETC门架钢结构(4+1)', spec: '', unit: '套', price: 220000 },
          { name: 'ETC门架钢结构(5+1)', spec: '', unit: '套', price: 273549 },
          { name: 'ETC门架钢结构(6+1)', spec: '', unit: '套', price: 296345 },
          { name: 'RSU天线(门架)', spec: '', unit: '套', price: 32000 },
          { name: 'RSU控制器', spec: '', unit: '套', price: 5000 },
          { name: '车牌图像识别设备', spec: '', unit: '套', price: 8000 },
          { name: '红外补光灯', spec: '', unit: '套', price: 1500 },
          { name: '车道控制器(门架)', spec: '', unit: '套', price: 25720 },
          { name: '设备监控控制器', spec: '', unit: '套', price: 20394 },
          { name: 'UPS 3KVA/8h', spec: '', unit: '套', price: 42000 },
          { name: '安全网关', spec: '', unit: '套', price: 41182 },
          { name: '室外机柜(门架)', spec: '', unit: '台', price: 50633 },
          { name: '配电模块', spec: '', unit: '套', price: 5267 },
          { name: '空调', spec: '', unit: '套', price: 5000 },
          { name: '电子门禁', spec: '', unit: '套', price: 15184 },
          { name: '柜外视频监控', spec: '', unit: '套', price: 8147 },
          { name: '全景摄像机', spec: '', unit: '套', price: 10000 },
          { name: 'ETC门架UPS', spec: '', unit: '套', price: 80000 },
          { name: 'C级单相电源防雷器', spec: '', unit: '套', price: 1381 },
          { name: 'BC级三相复合型电源防雷器', spec: '', unit: '套', price: 5131 },
          { name: '网络信号防雷器', spec: '', unit: '套', price: 581 },
          { name: '防雷监测终端', spec: '', unit: '套', price: 5800 },
          { name: 'SPD智能防雷监测终端(BC级三相)', spec: '', unit: '套', price: 7959 },
          { name: '通信光缆48芯', spec: '', unit: '米', price: 25 },
          { name: '通信光缆38芯', spec: '', unit: '米', price: 19 },
          { name: '通信光缆28芯', spec: '', unit: '米', price: 17 },
          { name: '通信光缆4芯', spec: '', unit: '米', price: 12 },
          { name: '光缆接续盒 48D', spec: '', unit: '套', price: 2800 },
          { name: '悬臂式信息标志板', spec: '', unit: '套', price: 227565 },
          { name: '门架式信息标志板', spec: '', unit: '套', price: 360000 }
        ]
      },
      {
        id: 's2020-noise-green',
        name: '声屏障与公路绿化设施',
        items: [
          { name: '声屏障', spec: '综合价格含立柱基础板面', unit: '平方米', price: 1200 },
          { name: '隔音墙钢化夹胶玻璃屏', spec: '1970mm×1350mm', unit: '块', price: 1500 },
          { name: '声屏障立柱', spec: '', unit: '根', price: 1500 },
          { name: '声屏障裙边', spec: '', unit: 'kg', price: 23 },
          { name: '声屏障基础', spec: '', unit: '米', price: 800 },
          { name: '普通乔木', spec: '胸径3cm~10cm', unit: '株', price: 560 },
          { name: '普通人工草坪', spec: '', unit: '平方米', price: 40 },
          { name: '普通灌木', spec: '苗高×冠幅 80×60', unit: '丛', price: 117 },
          { name: '普通灌木', spec: '苗高×冠幅 100×80', unit: '丛', price: 196 },
          { name: '普通灌木', spec: '苗高×冠幅 120×100', unit: '丛', price: 334 },
          { name: '普通灌木', spec: '苗高×冠幅 150×120', unit: '丛', price: 438 },
          { name: '普通灌木', spec: '苗高×冠幅 100×60', unit: '株', price: 174 },
          { name: '普通灌木', spec: '苗高×冠幅 120×80', unit: '株', price: 229 },
          { name: '普通灌木', spec: '苗高×冠幅 150×100', unit: '株', price: 335 },
          { name: '普通灌木', spec: '苗高×冠幅 200×150', unit: '株', price: 508 },
          { name: '时花', spec: '', unit: '平方米', price: 120 },
          { name: '乔木', spec: '胸径5cm及以下', unit: '株', price: 575 },
          { name: '乔木', spec: '胸径6cm~10cm', unit: '株', price: 933 },
          { name: '乔木', spec: '胸径11cm~20cm', unit: '株', price: 1943 },
          { name: '乔木', spec: '胸径21cm~30cm', unit: '株', price: 2985 },
          { name: '乔木', spec: '胸径31cm~40cm', unit: '株', price: 4129 },
          { name: '乔木', spec: '胸径41cm~50cm', unit: '株', price: 4878 },
          { name: '乔木', spec: '胸径51cm~60cm', unit: '株', price: 5498 },
          { name: '乔木', spec: '胸径61cm~70cm', unit: '株', price: 6009 }
        ]
      },
      {
        id: 's2020-charger',
        name: '充电桩设施',
        items: [
          { name: '120kW一体双枪直流快充充电桩', spec: '', unit: '台', price: 150000 },
          { name: '充电站雨棚(钢结构)', spec: '', unit: '座', price: 100000 },
          { name: '充电站广告灯箱', spec: '', unit: '座', price: 20000 }
        ]
      }
    ]
  }
]

module.exports = {
  categories: categories,
  standards: standards
}
