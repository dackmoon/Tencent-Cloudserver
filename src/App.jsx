import { useEffect, useRef, useState, useCallback } from 'react'
import Chart from 'chart.js/auto'
import './App.css'

// ── 报告章节数据 ──────────────────────────────────────────────

const chapters = [
  {
    id: 'ch1',
    num: '一',
    title: '背景与趋势',
    sections: [
      {
        title: '金融风控面临的新挑战',
        content: [
          { type: 'p', text: '在金融科技快速迭代的背景下，传统风控体系正面临多维度的挑战。一方面，黑产攻击手法从早期的简单伪造发展到如今的AI驱动的深度伪造、设备农场集群操控，攻击速度和复杂度呈指数级上升；另一方面，监管对数据隐私、模型可解释性和公平性的要求日趋严格，银行和消费金融公司必须在合规框架内实现更精准的风险识别。与此同时，实时授信、即时审批等用户体验需求对风控系统的延迟容忍度降至毫秒级，而传统规则引擎+人工审核的串行模式已难以满足这一要求。' },
          {
            type: 'bullets',
            items: [
              { term: '黑产演化', desc: '攻击手法从单一伪造演变为AI驱动的团伙化、工具化、产业化运作，传统规则防御被动滞后。' },
              { term: '合规压力', desc: '《个人信息保护法》《征信业务管理办法》等法规对数据采集、使用和模型决策透明度提出更高要求。' },
              { term: '实时性需求', desc: '秒级审批体验成为行业标配，离线批处理模式无法满足在线实时决策的延迟要求。' },
              { term: '数据碎片化', desc: '内部数据、征信数据、三方数据分散在异构系统中，特征整合成本高、时效性差。' },
            ],
          },
        ],
      },
      {
        title: 'AI 在风控领域的应用演进',
        content: [
          { type: 'p', text: '风控技术的演进可以划分为四个阶段：从最初基于专家经验的规则引擎，到以XGBoost为代表的传统机器学习方法，再到深度学习在图网络和序列建模中的渗透，直至2023年以后大语言模型和AI Agent的涌现。每一次跃迁都显著提升了策略的精准度、自动化程度和响应速度。' },
          {
            type: 'table',
            headers: ['阶段', '时间窗口', '代表技术', '核心能力', '典型局限'],
            rows: [
              ['规则引擎', '~2014', 'Drools / DSL 规则', '策略可读、部署快速', '规则爆炸、更新滞后'],
              ['传统ML', '2014-2019', 'XGBoost / LR / GBDT', '表格数据 SOTA、高精度', '依赖人工特征工程'],
              ['深度学习', '2019-2023', 'GNN / LSTM / Transformer', '序列+图建模能力强', '可解释性不足'],
              ['LLM + Agent', '2023+', 'GPT / DeepSeek / RAG', '语义理解+自主决策链', '幻觉、推理成本高'],
            ],
          },
          { type: 'p', text: '当前行业正处于从第三阶段向第四阶段过渡的关键窗口。理解每个阶段的技术原理和适用边界，是选择正确工具的前提。' },
        ],
      },
    ],
  },
  {
    id: 'ch2',
    num: '二',
    title: 'AI 技术基础：从模型到智能体',
    sections: [
      {
        title: '2.1 机器学习基础回顾',
        content: [
          {
            type: 'p',
            text: '机器学习是AI体系的核心支柱。在金融风控场景下，理解不同学习范式的特点和适用边界，是进行技术选型的基础。监督学习主导信用评分和欺诈检测，无监督学习在异常检测和客户分群中发挥关键作用，而强化学习则逐步应用于策略寻优和动态定价领域。',
          },
          {
            type: 'bullets',
            items: [
              { term: '监督学习', desc: '基于有标签数据训练模型进行预测，风控中最常见的范式。典型应用：信用评分（分类）、额度定价（回归）、PD/LGD 预测。代表算法：逻辑回归、XGBoost、LightGBM、CatBoost。' },
              { term: '无监督学习', desc: '无需标签，从数据中自动发现模式和结构。典型应用：异常交易检测（孤立森林）、客群分层（K-Means）、特征降维（PCA）。' },
              { term: '强化学习', desc: '通过与环境交互、奖励信号驱动策略优化。典型应用：动态额度调整、智能催收策略选择、策略组合寻优。' },
            ],
          },
          {
            type: 'callout',
            text: '为什么树模型在风控表格数据中仍占主导？树模型天然处理缺失值、对特征尺度不敏感、可输出特征重要性、在小样本场景稳定可靠，且SHAP等解释工具对树模型的支持最为成熟。在监管合规要求严格的金融场景下，这些特性让树模型仍是大多数信用评分卡的第一选择。',
          },
          {
            type: 'p',
            text: '深度学习在风控中的适用边界在于：需要建模复杂非线性关系且数据量充足的场景。如图神经网络用于欺诈团伙关联挖掘、Transformer用于用户行为序列建模。但当数据量有限或对可解释性有刚性要求时，传统ML仍是更可靠的选择。',
          },
        ],
      },
      {
        title: '2.2 大语言模型（LLM）发展脉络',
        content: [
          {
            type: 'p',
            text: '2017年Vaswani等人提出的Transformer架构（论文《Attention is All You Need》）是现代大语言模型的基石。其核心创新——自注意力机制，使模型能够并行处理序列中的任意位置依赖关系，突破了RNN/LSTM的顺序计算瓶颈。此后技术演进加速：GPT系列证明了生成式预训练+规模扩展的有效性，ChatGPT（GPT-3.5，2022.11）将RLHF对齐技术带入主流视野，GPT-4（2023.3）在多模态和推理能力上实现跃升。',
          },
          {
            type: 'p',
            text: '在开源侧，Meta的Llama系列、阿里的Qwen系列、DeepSeek等模型的快速追赶，将高性能LLM从少数闭源厂商的垄断中解放出来。特别是DeepSeek-V3/R1在数学推理和代码生成上的突破，以及Qwen在中文金融场景下的适配优化，为金融行业本地部署LLM提供了可行的技术路径。',
          },
          {
            type: 'bullets',
            items: [
              { term: '上下文学习', desc: 'LLM可以通过少量示例（Few-shot）快速适应新任务，无需微调即可完成分类、抽取、生成等任务。' },
              { term: '思维链推理', desc: '通过CoT（Chain-of-Thought）提示，模型将复杂问题分解为多步推理，显著提升逻辑分析准确率。' },
              { term: '工具调用', desc: 'Function Calling能力使LLM能调用外部API、数据库、计算引擎，突破纯语言模型的边界。' },
              { term: '核心局限', desc: '幻觉（生成不实信息）、知识截止日期限制、推理延迟与成本较高、缺乏领域深度知识。在金融风控等高精度场景中，LLM不适合直接做决策，而应在辅助、总结、编码等创造性任务中发挥价值。' },
            ],
          },
        ],
      },
      {
        title: '2.3 AI Agent 体系',
        content: [
          {
            type: 'p',
            text: 'AI Agent是将LLM从"聊天工具"升级为"自主任务执行者"的关键架构。其核心思想是让LLM扮演"大脑"，通过感知环境、制定计划、调用工具、存储记忆、执行动作的循环，完成复杂的多步任务。这一范式将风控中原本需要人工编排的多系统协作，转化为Agent的自主推理链。',
          },
          {
            type: 'bullets',
            items: [
              { term: '感知（Perception）', desc: '接收用户意图和系统上下文，理解当前任务目标和约束。' },
              { term: '规划（Planning）', desc: '将复杂目标拆解为可执行的子任务序列，决定调用哪些工具和步骤顺序。' },
              { term: '工具（Tools）', desc: '通过Function Calling调用外部能力：SQL查询、模型推理、规则引擎、邮件/消息推送。' },
              { term: '记忆（Memory）', desc: '短期记忆（对话上下文）+ 长期记忆（向量数据库存储的历史经验和案例），支撑知识复用。' },
              { term: '执行（Action）', desc: '调度工具完成任务，观察结果，根据反馈调整后续步骤，形成闭环。' },
            ],
          },
          {
            type: 'p',
            text: '在架构模式上，单Agent适用于明确、线性的任务；多Agent协作（如AutoGen、CrewAI等框架）适用于需要多角色协同的复杂场景，不同Agent分别负责数据查询、策略生成、合规核查、效果评估等子任务。人机协同（Human-in-the-loop）则是在关键决策节点引入人工确认，是金融高风险场景的必备安全机制。' },
          {
            type: 'table',
            headers: ['框架', '核心特点', '适用场景'],
            rows: [
              ['LangChain', '工具链最全，生态成熟，LCEL 编排灵活', 'RAG问答、规则生成、数据分析'],
              ['LangGraph', '有状态图编排，支持分支与循环', '多步风控流程、审批工作流'],
              ['AutoGen', '多Agent对话协作，角色灵活', '策略评审、多维度交叉验证'],
              ['CrewAI', '角色定义清晰，上手简单', '小型Agent团队试点'],
            ],
          },
        ],
      },
      {
        title: '2.4 AI 在金融行业的应用全景',
        content: [
          {
            type: 'p',
            text: '全球范围内，AI在金融行业的应用正从"试点探索"转向"规模化部署"。J.P. Morgan的COiN平台用NLP解析法律文件，每年节省数十万人工时；蚂蚁集团的智能风控引擎实现毫秒级实时决策；Capital One将ML深度嵌入信用评估全流程。与此同时，各国监管态度呈现"鼓励创新+严守合规"的双轨特征——中国金融监管总局强调模型风险管理和算法备案，欧盟AI Act对金融领域AI应用设定分级监管。',
          },
          {
            type: 'bullets',
            items: [
              { term: '可解释性', desc: '监管要求每笔拒贷必须输出清晰的原因码，模型决策路径可回溯、可审计。' },
              { term: '公平性', desc: '模型不得基于性别、种族、地域等敏感特征产生歧视性决策，需通过公平性测试。' },
              { term: '数据隐私', desc: '征信数据、交易数据的使用必须遵循最小必要原则，联邦学习和隐私计算成为合规突破口。' },
              { term: '模型风险管理', desc: 'SR 11-7 / MRM框架要求建立模型生命周期文档、定期验证和独立审计机制。' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ch3',
    num: '三',
    title: '模型：从评分卡到智能体',
    sections: [
      {
        title: '3.1 传统信用评分模型',
        content: [
          {
            type: 'p',
            text: '在金融风控领域，逻辑回归和XGBoost仍是信用评分模型的基石。逻辑回归以其天然的得分映射特性和监管友好性，在申请评分卡（A卡）和行为评分卡（B卡）中广泛应用。XGBoost/LightGBM则凭借自动处理缺失值、内置特征交互和优秀的泛化能力，在反欺诈和违约概率（PD）预测中持续取得SOTA表现。实际生产中，通常将两者的优势结合：XGBoost用于特征筛选和高阶交互发现，LR用于最终评分的校准和输出。',
          },
          {
            type: 'bullets',
            items: [
              { term: 'PD 模型（违约概率）', desc: '预测借款人在未来一定期限内发生违约的概率。常用XGBoost+LR混合架构，核心特征包括多头借贷、逾期历史、收入负债比等。模型输出映射为信用评分（如300-900分）。' },
              { term: 'LGD 模型（违约损失率）', desc: '预测违约发生后债权损失的比率。Beta回归或分阶段建模（催收回收意愿+抵押物变现价值），对催收策略制定起关键作用。' },
              { term: 'EAD 模型（违约风险敞口）', desc: '预测违约时已提取额度占授信额度的比例。对于循环信贷产品（如信用卡），EAD建模直接关系资本充足率计算。' },
              { term: '催收评分卡（C卡）', desc: '根据逾期后的还款行为、接触响应等特征，对逾期客户进行催收优先级分级，驱动差异化的催收策略。' },
            ],
          },
        ],
      },
      {
        title: '3.2 深度学习在风控中的应用',
        content: [
          {
            type: 'p',
            text: '深度学习在金融风控中并非万能，但在特定场景下具有传统ML不可替代的优势。主要集中于两类场景：对时序行为模式的深度挖掘（LSTM/Transformer）和对关系网络的欺诈检测（GNN）。两者的共同前提是数据量充足、特征维度高、且业务容错率允许适当的模型复杂度。',
          },
          {
            type: 'bullets',
            items: [
              { term: '时序行为建模', desc: 'LSTM和Transformer通过建模用户历史交易、登录、设备切换等行为的时间序列模式，捕捉传统聚合特征无法表达的行为演变趋势。例如：用户近30天交易频率的加速下降可能预示流失或欺诈前兆。' },
              { term: '图神经网络（GNN）', desc: '通过构建用户-设备-IP-手机号的多维度关联图谱，GNN能有效识别欺诈团伙的聚集性特征。一个典型的案例是：单一设备登录多个账户→账户间共享IP段→账户申请时间高度集中，GNN将这种多跳关联路径编码为可学习的图嵌入表示。' },
            ],
          },
        ],
      },
      {
        title: '3.3 大模型与风控结合',
        content: [
          {
            type: 'p',
            text: 'LLM在风控中的价值不在于替代传统的信用评分模型，而是在于处理传统模型无法覆盖的"非结构化"和"知识密集型"任务。当前业界探索的主要方向包括：',
          },
          {
            type: 'list',
            items: [
              '规则生成：用自然语言描述风控需求（如"近3天申请超过5次的用户拦截"），LLM将需求直接翻译为可执行的Drools规则或SQL。',
              '报告撰写：根据模型监控数据自动生成周报/月报，总结KS变化趋势、特征漂移情况和策略调整建议。',
              '政策RAG：将内部合规手册、监管政策文档向量化，支持风控人员以自然语言查询"某类客群的准入政策是否合规"。',
              '非结构化数据提取：从合同文本、审批备注、客服工单等非结构化数据中提取关键风险信号，补充到模型特征体系中。',
            ],
          },
        ],
      },
      {
        title: '3.4 Agent 化风控',
        content: [
          {
            type: 'p',
            text: 'Agent化是风控智能化的下一个演进方向。其本质是将原本由风控分析师手动编排的"发现问题→定位原因→生成策略→验证效果→灰度上线"全流程，转化为Agent自主调度的多步推理与执行链。每个环节对应不同的工具调用和数据源，Agent作为"调度大脑"负责路由、校验和纠错。',
          },
          {
            type: 'p',
            text: '在实际架构中，风控Agent通常包含：数据查询Agent（SQL生成+执行）、模型推理Agent（调用PD/反欺诈模型服务）、策略生成Agent（规则合成+合规对齐）、效果评估Agent（回测+收益曲线计算）。多Agent通过消息总线协作，状态由持久化Memory保存，确保断点续推和可审计性。',
          },
        ],
      },
      {
        title: '3.5 模型可解释性与合规',
        content: [
          {
            type: 'p',
            text: '在金融监管框架下，模型可解释性不是加分项而是必选项。SHAP（Shapley Additive Explanations）是当前行业标准工具，它基于博弈论中的Shapley值将单个预测结果公平分解为各特征的贡献度。对于单笔拒贷，SHAP可输出"多头借贷次数贡献+15分，收入负债比贡献-8分"等逐特征归因。',
          },
          {
            type: 'chart',
            chartId: 'model-interpretability',
          },
        ],
      },
    ],
  },
  {
    id: 'ch4',
    num: '四',
    title: '数据：特征体系与工程化',
    sections: [
      {
        title: '4.1 数据源全景',
        content: [
          {
            type: 'p',
            text: '风控模型的效果上限由数据质量决定。当前金融机构可获取的数据源已形成多层体系：从央行征信的基础信用画像，到设备指纹的行为轨迹，再到三方数据的外部交叉验证。构建统一、实时、可信的数据层是AI风控系统的第一道工程门槛。',
          },
          {
            type: 'chart',
            chartId: 'data-source-coverage',
          },
        ],
      },
      {
        title: '4.2 特征工程方法论',
        content: [
          {
            type: 'p',
            text: '特征工程是风控建模中最耗时但也最关键的环节。数据决定了模型的上限，而特征工程决定了接近这个上限的程度。核心方法论包括：时序窗口聚合（以当前时刻为锚点，向前取7天/30天/90天/180天滑动窗口计算count、sum、mean、std等统计量）、交叉特征（多头借贷次数 × 设备关联账户数）、以及WOE/IV编码（将连续变量离散化后映射为证据权重，确保特征与目标的单调关系）。',
          },
          {
            type: 'bullets',
            items: [
              { term: '时序窗口聚合', desc: '以事件时间为锚点，对过去N天内的行为计数、求和、均值、标准差。典型窗口：7d/14d/30d/90d/180d。需注意信息泄漏（不能使用未来数据聚合历史窗口）。' },
              { term: '交叉特征', desc: '两两或多维特征的交互组合，如"多头借贷次数 × 收入水平"、"设备关联账户数 × IP异常度"。树模型本身具备自动交叉能力，但显式构造的交叉特征可降低模型学习难度。' },
              { term: 'WOE/IV 编码', desc: 'Weight of Evidence通过比较好坏样本在各分箱中的分布，将原始特征转换为与违约概率单调相关的分值。IV（Information Value）用于衡量特征的预测能力：IV<0.02为弱特征，IV>0.3为强特征。' },
              { term: '分箱策略', desc: '等频分箱（每箱样本量相近）适用于分布均匀的特征；等距分箱适用于范围固定的特征；卡方分箱通过合并相似区间优化IV值，适用于提升模型区分度。' },
            ],
          },
        ],
      },
      {
        title: '4.3 自动化特征工程（AutoFE）',
        content: [
          {
            type: 'p',
            text: '传统特征工程依赖风控专家的手工经验，周期长、覆盖面有限。AutoFE系统通过预定义的基础算子（聚合、差分、比率、时序衰减加权等），对原始字段进行自动遍历组合，生成候选高阶特征，再通过特征重要性评估和IV筛选进行剪枝，最终输出优化后的特征集。这一流程可将特征加工周期从数天压缩至数小时。',
          },
          {
            type: 'list',
            items: [
              '算子库：count、sum、mean、std、max、min、diff、ratio、ema（指数衰减加权平均）等基础算子',
              '自动组合：原始字段 × 算子 × 时间窗口的三维遍历，生成候选特征池',
              '特征筛选：基于IV值、相关性（>0.8剔除）、缺失率（>80%剔除）、PSI稳定性进行多维过滤',
              '增量更新：新特征自动与在线特征库对比，仅保留增量贡献显著的候选',
            ],
          },
        ],
      },
      {
        title: '4.4 特征稳定性监控',
        content: [
          {
            type: 'p',
            text: '模型上线后，特征分布的变化往往先于模型效果的衰退。PSI（Population Stability Index）是最常用的特征漂移检测指标，它衡量当前样本分布与建模基准样本分布的偏离程度。PSI < 0.1 表示分布稳定，0.1-0.25 需关注，> 0.25 表示显著偏移需排查根因。在实际生产中，通常对Top N个重要特征建立PSI监控面板，配合KS检验和Wasserstein距离进行多维度的分布偏移预警。',
          },
        ],
      },
    ],
  },
  {
    id: 'ch5',
    num: '五',
    title: '场景：全链路 AI 落地',
    sections: [
      {
        title: '5.1 贷前：反欺诈与信用评估',
        content: [
          {
            type: 'p',
            text: '贷前是风控策略最密集的环节，需要在毫秒级完成多维度风险评估。典型的贷前AI管线包括：设备指纹校验（识别模拟器、多开、Root等风险环境）→ 反欺诈模型（多头借贷、黑名单、关联网络）→ 信用评分（PD模型输出信用分）→ 风险定价（基于风险等级和LGD预测差异化定价）→ 准入决策（综合以上输出给出通过/拒绝/人工审核的最终决策）。AI在每个节点的价值体现在：规则策略的自动化寻优、模型精度的持续提升、以及人工审核中AI辅助的个案分析。',
          },
        ],
      },
      {
        title: '5.2 贷中：动态监控与额度管理',
        content: [
          {
            type: 'p',
            text: '贷中风控的核心是动态感知客户的信用变化并提前干预。行为评分卡（B卡）是基于客户用款、还款、消费等贷后行为数据训练的模型，通常以月为周期滚动更新。AI的价值在于：将行为评分的更新频率从月级提升到日级（基于实时行为流），通过异常行为检测模型（如交易频率突增、异地登录频次上升等信号）触发动态额度调整（降额/冻结）或早期预警，在逾期发生前采取主动干预措施。',
          },
        ],
      },
      {
        title: '5.3 贷后：智能催收与资产处置',
        content: [
          {
            type: 'p',
            text: '贷后催收的核心效率指标是在成本约束下最大化回款率。AI在催收链条中的主要应用包括：催收评分卡（C卡）对逾期客户进行回款意愿和能力的精细化分级（A/B/C/D级），驱动差异化的催收策略（短信→AI外呼→人工电催→委外→法催）。特别是大模型驱动的AI外呼，能够根据催收对象的语气、还款意愿、困难陈述实时调整话术策略，相比传统IVR在接通率和回款率上有显著提升。失联修复则是利用关联网络和外部数据建立客户触达图谱，找回率是衡量模型效果的核心指标。',
          },
        ],
      },
      {
        title: '5.4 贯穿全局：策略寻优与实验体系',
        content: [
          {
            type: 'p',
            text: '风控不是一次性建模，而是持续的优化迭代过程。贯穿贷前/贷中/贷后的横切能力包括策略寻优引擎（基于进化算法在数千种规则组合中搜索帕累托最优解）和A/B实验体系（将流量切分为对照组和挑战者组，在真实流量中验证新策略的效果）。当挑战者策略胜出，系统自动推全；当核心指标劣化，自动触发熔断回滚。这一闭环使风控策略的迭代频率从季度级缩短至天级。',
          },
        ],
      },
    ],
  },
  {
    id: 'ch6',
    num: '六',
    title: '交付：MLOps 与工程化闭环',
    sections: [
      {
        title: '6.1 模型生命周期管理',
        content: [
          {
            type: 'p',
            text: '模型从开发到退役的完整生命管理是MLOps的核心课题。一个风控模型会经历：数据准备（样本定义、特征拼接、标签选取）→ 特征工程 → 离线训练与验证（KS/AUC/PSI评估）→ 模型审查（合规评审、可解释性检查）→ 线上部署（模型服务化、灰度发布）→ 运行监控（KS衰减、特征漂移、预测分布偏移）→ 模型退役（效果降至阈值以下，触发重训或替换）。每个阶段的交付物和审批节点需在系统中有明确的元数据记录，以满足MRM审计要求。',
          },
          {
            type: 'chart',
            chartId: 'mlops-pipeline',
          },
        ],
      },
      {
        title: '6.2 实时与离线推理架构',
        content: [
          {
            type: 'p',
            text: '风控场景对推理架构的要求是"离线跑得动、在线跑得快"混合模式。离线层基于Apache Spark或Flink进行批量特征计算和模型打分，输出客群级别的风险画像，支撑T+1的策略分析和报表输出。在线层则要求毫秒级响应：当用户提交申请时，实时特征服务（Feature Store）在10ms内返回当前快照特征，模型服务完成推理，规则引擎执行准入判断，整个链路通常要求在200ms内完成。中间状态则通过近线增量管道（Kafka + Flink）将实时事件持续更新到特征存储中。',
          },
        ],
      },
      {
        title: '6.3 监控与告警体系',
        content: [
          {
            type: 'p',
            text: '模型监控的核心理念是"在业务感知到问题之前自动发现"ML指标衰退。监控体系分为三个维度：模型效果监控（KS、AUC、Gini等区分度指标的周度/月度趋势）、特征稳定性监控（Top N特征的PSI值、分布直方图偏移）、以及预测分布监控（模型输出的分数分布变化、拒绝率变化）。当任一指标突破预设阈值，告警自动触发，并根据严重程度自动执行不同程度的响应：轻度偏离记录日志、中度偏离通知模型Owner排查、严重偏离自动触发熔断回滚至安全基线模型。',
          },
        ],
      },
      {
        title: '6.4 从监控到重训的自动闭环',
        content: [
          {
            type: 'p',
            text: 'MLOps的终极目标是将"发现问题→排查根因→数据补充→模型重训→验证上线"这条人工链路转化为自动化回路。当监控系统检测到模型KS持续下滑时，自动触发根因分析Agent（特征PSI排查、客群画像对比、外部环境变化检测）；若确认为模型衰退（而非客群变化），自动启动重训流水线（使用最新标注数据、启用AutoFE生成新特征候选）；新模型完成离线验证后自动注册到模型仓库并提交A/B挑战者实验；实验胜出后全量切换，整个闭环无需人工介入。目前行业普遍可实现半自动化（人工确认关键节点），完全自动化仍需在合规审计和变更审批之间寻找平衡。',
          },
        ],
      },
    ],
  },
  {
    id: 'ch7',
    num: '七',
    title: '挑战与展望',
    sections: [
      {
        title: '数据隐私与合规技术',
        content: [
          {
            type: 'p',
            text: '数据是风控的燃料，但隐私保护是燃料的安全阀。在《个人信息保护法》和《数据安全法》框架下，跨机构数据协作面临严格的合规约束。隐私计算（联邦学习、多方安全计算、可信执行环境）为"数据可用不可见"提供了技术解决路径：通过联邦学习，多家机构共同训练一个风控模型，各自的数据始终保留在本地，仅传递加密的梯度更新；通过多方安全计算，征信查询和黑名单匹配可以在不暴露各方原始数据的前提下完成。目前这些技术在效率和安全性的平衡上仍在快速演进中。',
          },
        ],
      },
      {
        title: '模型公平性与算法偏见',
        content: [
          {
            type: 'p',
            text: '公平性在风控中不仅是一个技术问题，更是一个监管和社会责任问题。从技术角度看，公平性可以分为：群体公平（不同群体应获得相似的审批率/利率）和个体公平（相似个体应获得相似决策）。确保模型公平性需要在样本构建（平衡各类群体的训练样本）、特征选择（剔除或降权可能引入偏见的敏感特征）、以及模型后处理（对偏差进行校准和修正）三个环节同时着力。拒绝推断（Reject Inference）是其中的关键难题：我们只能观测被审批通过的客户的还款表现，而被拒绝的客户其真实风险是未知的，这一选择偏差可能导致模型越来越保守。',
          },
        ],
      },
      {
        title: '从辅助决策到自主决策的信任鸿沟',
        content: [
          {
            type: 'p',
            text: '当前AI在风控中的角色定位是"辅助人决策"，但技术演进的方向正在模糊这一边界。当Agent系统能够在数分钟内完成从数据分析到策略生成的完整闭环，并且回测结果优于人工方案时，是否应该允许其自主上线？这不仅是技术信任问题，更涉及责任归属——当AI自主决策导致重大损失时，责任由模型开发者、策略Owner还是审批流程的每个节点承担？渐进式的信任建立路径可能是：从低风险场景（如营销短信的A/B策略调整）开始自主化，逐步向中等风险场景（如催收策略微调）扩展，高风险场景（如授信准入阈值变更）长期保留人工确认。',
          },
        ],
      },
      {
        title: 'Agent 在金融高风险场景的可靠性边界',
        content: [
          {
            type: 'p',
            text: 'Agent系统在金融风控中的最大风险不是能力不足，而是能力边界模糊。LLM可能在某些推理任务上表现惊艳，但在简单的数学计算或逻辑一致性上出错。在风控场景中，一个策略调整的建议如果包含了未被察觉的幻觉（如引用了一条不存在的合规条款），可能导致合规事故。因此，Agent在金融场景中的可靠性工程至关重要：输出需通过规则校验层（格式、数值范围、合规条款引用验证），操作需通过权限控制层（高风险操作必须经过审批），状态需全量记录（满足审计回溯的完整性要求）。简而言之，Agent的"智能"需要用工程的"严谨"来约束。',
          },
        ],
      },
    ],
  },
]

// ── 图表配置 ──────────────────────────────────────────────────

const chartConfigs = {
  'model-interpretability': {
    render: (canvas) => new Chart(canvas, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: '传统模型',
            data: [
              { x: 85, y: 90, r: 12 },
              { x: 78, y: 80, r: 15 },
            ],
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
          },
          {
            label: '集成树模型',
            data: [
              { x: 70, y: 75, r: 12 },
              { x: 73, y: 70, r: 10 },
              { x: 68, y: 78, r: 11 },
            ],
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
          },
          {
            label: '深度学习',
            data: [
              { x: 40, y: 60, r: 13 },
              { x: 35, y: 55, r: 10 },
            ],
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
          },
          {
            label: '大语言模型',
            data: [{ x: 15, y: 40, r: 18 }],
            backgroundColor: 'rgba(234, 179, 8, 0.5)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: '可解释性' }, min: 0, max: 100, grid: { color: '#f1f5f9' } },
          y: { title: { display: true, text: '预测精度' }, min: 0, max: 100, grid: { color: '#f1f5f9' } },
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const labels = {
                  '传统模型': ['逻辑回归', '朴素贝叶斯'],
                  '集成树模型': ['XGBoost', 'LightGBM', 'CatBoost'],
                  '深度学习': ['LSTM', 'Transformer'],
                  '大语言模型': ['GPT-4 / DeepSeek'],
                }
                const modelName = labels[ctx.dataset.label]?.[ctx.dataIndex] ?? ''
                return `${modelName}: 精度 ${ctx.raw.y} / 可解释性 ${ctx.raw.x}`
              },
            },
          },
        },
      },
    }),
  },
  'data-source-coverage': {
    render: (canvas) => new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['覆盖广度', '数据时效', '数据质量', '接入成本', '合规风险', '预测贡献'],
        datasets: [
          { label: '央行征信', data: [60, 70, 95, 80, 90, 85], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)' },
          { label: '设备指纹', data: [90, 95, 75, 60, 55, 70], borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.1)' },
          { label: '三方多头', data: [85, 80, 60, 50, 40, 80], borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)' },
          { label: '行为埋点', data: [75, 90, 85, 40, 65, 75], borderColor: '#d97706', backgroundColor: 'rgba(217,119,6,0.1)' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { ticks: { display: false }, grid: { color: '#e2e8f0' } } },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
      },
    }),
  },
  'mlops-pipeline': {
    render: (canvas) => new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['数据准备', '特征工程', '模型训练', '合规审查', '灰度部署', '运行监控'],
        datasets: [
          { label: '传统模式 (天)', data: [3, 5, 2, 4, 2, 1], backgroundColor: '#cbd5e1' },
          { label: 'MLOps 自动化 (天)', data: [0.2, 0.3, 0.1, 0.5, 0.1, 0.05], backgroundColor: '#2563eb' },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: '耗时 (天)' }, grid: { display: false } },
          y: { grid: { display: false } },
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } },
      },
    }),
  },
}

// ── 内容渲染器 ────────────────────────────────────────────────

function ContentBlock({ block }) {
  switch (block.type) {
    case 'p':
      return <p className="text-stone-600 leading-relaxed mb-4">{block.text}</p>
    case 'bullets':
      return (
        <div className="mb-4 space-y-3">
          {block.items.map((item) => (
            <div key={item.term} className="pl-4 border-l-2 border-blue-200">
              <span className="font-semibold text-stone-800 text-sm">{item.term}</span>
              <p className="text-stone-500 text-sm mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      )
    case 'list':
      return (
        <ul className="mb-4 space-y-1.5 text-stone-600 text-sm">
          {block.items.map((item, i) => (
            <li key={i} className="flex before:content-['—'] before:mr-2 before:text-blue-400">{item}</li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-200">
                {block.headers.map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold text-stone-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 px-3 text-stone-600">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'callout':
      return (
        <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800 leading-relaxed">{block.text}</p>
        </div>
      )
    case 'chart':
      return (
        <div className="chart-container mb-4">
          <canvas id={block.chartId}></canvas>
        </div>
      )
    default:
      return null
  }
}

// ── 主组件 ────────────────────────────────────────────────────

function App() {
  const [activeChapter, setActiveChapter] = useState('ch1')
  const sectionRefs = useRef({})
  const chartRefs = useRef([])

  // 章节滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveChapter(visible[0].target.id)
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    )

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // 图表渲染
  useEffect(() => {
    Chart.defaults.font.family =
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    Chart.defaults.font.size = 11

    const charts = []

    Object.entries(chartConfigs).forEach(([chartId, config]) => {
      const canvas = document.getElementById(chartId)
      if (canvas) {
        charts.push(config.render(canvas))
      }
    })

    chartRefs.current = charts

    return () => {
      chartRefs.current.forEach((chart) => chart.destroy())
      chartRefs.current = []
    }
  }, [])

  // 点击导航滚动
  const scrollToChapter = useCallback((chapterId) => {
    const el = sectionRefs.current[chapterId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* 左侧导航 */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-stone-200 h-screen sticky top-0 overflow-y-auto hidden md:block">
        <div className="px-5 py-6 border-b border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 leading-tight">
            AI 在金融风控领域的应用研究报告
          </h2>
          <p className="text-xs text-stone-400 mt-1">内部技术分享 · 2026</p>
        </div>
        <nav className="py-4">
          {chapters.map((ch) => {
            const isActive = ch.id === activeChapter
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className={`block w-full text-left px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-semibold'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span className="text-xs mr-1.5 opacity-60">{ch.num}</span>
                {ch.title}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* 移动端顶部导航 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 px-4 py-3">
        <h2 className="text-sm font-bold text-stone-900 truncate">AI在风控领域应用报告</h2>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => scrollToChapter(ch.id)}
              className={`whitespace-nowrap text-xs px-2.5 py-1 rounded-full transition ${
                ch.id === activeChapter
                  ? 'bg-blue-600 text-white'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {ch.num} {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0 md:pt-0 pt-24">
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          {/* 报告标题 */}
          <header className="mb-16 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              AI 在金融风控领域的应用研究报告
            </h1>
            <p className="mt-3 text-stone-500 text-lg">
              从模型原理到工程落地 —— 系统梳理 AI 技术在信用风险管理中的能力边界与实践路径
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-stone-400">
              <span>版本 1.0</span>
              <span>·</span>
              <span>内部技术分享</span>
              <span>·</span>
              <span>2026</span>
            </div>
          </header>

          {/* 各章节 */}
          {chapters.map((ch) => (
            <section
              key={ch.id}
              id={ch.id}
              ref={(el) => (sectionRefs.current[ch.id] = el)}
              className="mb-20"
            >
              <div className="mb-8">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  第{ch.num}章
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mt-1">{ch.title}</h2>
                <div className="mt-2 w-12 h-0.5 bg-blue-500"></div>
              </div>

              <div className="space-y-12">
                {ch.sections.map((section, si) => (
                  <div key={si}>
                    <h3 className="text-lg font-bold text-stone-800 mb-4">{section.title}</h3>
                    {section.content.map((block, bi) => (
                      <ContentBlock key={bi} block={block} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* 页脚 */}
          <footer className="border-t border-stone-200 pt-8 pb-12 text-center text-xs text-stone-400">
            <p>本报告仅供内部学习交流使用，不构成任何业务决策建议。</p>
            <p className="mt-1">数据来源基于公开行业研究和内部实践经验总结。</p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
