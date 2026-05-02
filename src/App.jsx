import { useEffect, useRef, useState, useCallback } from 'react'
import Chart from 'chart.js/auto'
import './App.css'

// ── 报告章节数据 ──────────────────────────────────────────────

const chapters = [
  {
    id: 'ch0',
    num: '导',
    title: '核心结论速览',
    sections: [
      {
        id: 'ch0-s0',
        title: '本报告要解决的问题',
        content: [
          {
            type: 'p',
            text: '面对工程团队的技术提案、AI 供应商的产品演示、以及内部 AI 项目的立项汇报，产品负责人最常遇到的困境是：听不懂、问不出关键问题、无法判断方案是否合理。本报告的目标不是让你成为 AI 技术专家，而是帮你建立一套"产品视角的 AI 认知框架"，使你能在合作中做出更有效的决策和判断。',
          },
          {
            type: 'insight-cards',
            cards: [
              {
                label: 'AI 的真正价值',
                text: 'AI 不会替代风控策略，但会让策略迭代从"季度级"加速到"天级"。速度优势和决策一致性，比单次精度提升更具战略价值。',
              },
              {
                label: '选对工具比选对模型更重要',
                text: '树模型（XGBoost 等）仍是评分卡主流，大语言模型适合处理"文字和推理"，不适合直接做信用决策。用错工具是 AI 项目失败的首要原因。',
              },
              {
                label: '数据质量决定 AI 上限',
                text: '特征工程（数据处理和变量构建）耗时占 AI 项目 60–70%。承诺"3 个月上线"的项目，如果没有完整的数据基础设施，时间大概率不够。',
              },
              {
                label: 'MLOps 是被低估的成本',
                text: '从 demo 到持续生产，需要完整的监控、告警和自动迭代机制。没有 MLOps，模型会在无人察觉的情况下悄悄衰退。',
              },
              {
                label: 'LLM 是助理，不是决策者',
                text: '大语言模型擅长报告撰写、政策解读、规则翻译；不擅长精确计算和高风险决策。在风控中应定位为"专家助理"而非"自动驾驶"。',
              },
              {
                label: '信任建立需要渐进路径',
                text: '从低风险场景（营销文案、报告摘要）开始 AI 自主化，逐步向中等风险延伸，高风险场景（授信准入）长期保留人工确认。',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ch1',
    num: '一',
    title: '背景与趋势',
    sections: [
      {
        id: 'ch1-s0',
        title: '金融风控面临的新挑战',
        content: [
          {
            type: 'p',
            text: '在金融科技快速迭代的背景下，传统风控体系正面临多维度的挑战。一方面，黑产攻击手法从早期的简单伪造发展到如今的 AI 驱动的深度伪造、设备农场集群操控，攻击速度和复杂度呈指数级上升；另一方面，监管对数据隐私、模型可解释性和公平性的要求日趋严格，银行和消费金融公司必须在合规框架内实现更精准的风险识别。与此同时，实时授信、即时审批等用户体验需求对风控系统的延迟容忍度降至毫秒级，而传统规则引擎+人工审核的串行模式已难以满足这一要求。',
          },
          {
            type: 'bullets',
            items: [
              { term: '黑产演化', desc: '攻击手法从单一伪造演变为 AI 驱动的团伙化、工具化、产业化运作，传统规则防御被动滞后。' },
              { term: '合规压力', desc: '《个人信息保护法》《征信业务管理办法》等法规对数据采集、使用和模型决策透明度提出更高要求。' },
              { term: '实时性需求', desc: '秒级审批体验成为行业标配，离线批处理模式无法满足在线实时决策的延迟要求。' },
              { term: '数据碎片化', desc: '内部数据、征信数据、三方数据分散在异构系统中，特征整合成本高、时效性差。' },
            ],
          },
          {
            type: 'product-insight',
            text: '评估风控 AI 项目时，先不要问"模型有多先进"，而要问它主要解决哪类压力：黑产对抗、合规审计、实时体验还是数据整合。问题定义不清，后续模型选型和投入预算都会失焦。',
          },
        ],
      },
      {
        id: 'ch1-s1',
        title: 'AI 在风控领域的应用演进',
        content: [
          {
            type: 'p',
            text: '风控技术的演进可以划分为四个阶段：从最初基于专家经验的规则引擎，到以 XGBoost 为代表的传统机器学习方法，再到深度学习在图网络和序列建模中的渗透，直至 2023 年以后大语言模型和 AI Agent 的涌现。每一次跃迁都显著提升了策略的精准度、自动化程度和响应速度。',
          },
          {
            type: 'table',
            headers: ['阶段', '时间窗口', '代表技术', '核心能力', '典型局限'],
            rows: [
              ['规则引擎', '~2014', 'Drools / DSL 规则', '策略可读、部署快速', '规则爆炸、更新滞后'],
              ['传统 ML', '2014–2019', 'XGBoost / LR / GBDT', '表格数据高精度', '依赖人工特征工程'],
              ['深度学习', '2019–2023', 'GNN / LSTM / Transformer', '序列+图建模能力强', '可解释性不足'],
              ['LLM + Agent', '2023+', 'GPT / DeepSeek / RAG', '语义理解+自主决策链', '幻觉、推理成本高'],
            ],
          },
          { type: 'p', text: '当前行业正处于从第三阶段向第四阶段过渡的关键窗口。理解每个阶段的技术原理和适用边界，是选择正确工具的前提。' },
          {
            type: 'product-insight',
            text: '当你在评估 AI 供应商方案或内部立项时，最重要的问题不是"用了什么模型"，而是"方案处于哪个技术阶段、你的业务复杂度是否匹配"。一家宣称用 LLM 直接做信用决策的公司，需要先回答它如何解决幻觉和监管可解释性问题。',
          },
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
        id: 'ch2-s0',
        title: '2.1 机器学习基础回顾',
        content: [
          {
            type: 'callout',
            text: '一个类比：机器学习就像给计算机提供了数千万份历史案件档案，让它自动总结出"什么样的申请人更可能违约"的规律——区别于人工总结规则的地方在于，机器能同时分析成百上千个维度，且永不疲倦、不受情绪影响。',
          },
          {
            type: 'p',
            text: '机器学习是 AI 体系的核心支柱。在金融风控场景下，理解不同学习范式的特点和适用边界，是进行技术选型的基础。监督学习主导信用评分和欺诈检测，无监督学习在异常检测和客户分群中发挥关键作用，而强化学习则逐步应用于策略寻优和动态定价领域。',
          },
          {
            type: 'bullets',
            items: [
              {
                term: '监督学习',
                desc: '基于有标签数据训练模型进行预测，风控中最常见的范式。典型应用：信用评分（分类）、额度定价（回归）、PD/LGD 预测。代表算法：逻辑回归、XGBoost、LightGBM、CatBoost。',
              },
              {
                term: '无监督学习',
                desc: '无需标签，从数据中自动发现模式和结构。典型应用：异常交易检测（孤立森林）、客群分层（K-Means）、特征降维（PCA）。',
              },
              {
                term: '强化学习',
                desc: '通过与环境交互、奖励信号驱动策略优化。典型应用：动态额度调整、智能催收策略选择、策略组合寻优。',
              },
            ],
          },
          {
            type: 'callout',
            text: '为什么树模型（XGBoost 等）在风控中仍是主流？ 它天然处理缺失值、对特征尺度不敏感、可输出特征重要性排序，且在监管要求"说清楚为什么拒绝"时，配合 SHAP 工具能逐特征给出理由。在数据量中等、合规要求严格的金融场景，树模型仍是大多数评分卡的第一选择。',
          },
          {
            type: 'product-insight',
            text: '当工程团队提议"用深度学习提升模型精度"时，你可以追问：（1）样本量是否足够支撑深度学习？（2）监管是否接受可解释性降低？（3）推理延迟是否在业务允许范围内？不是越复杂的模型越好，适合业务约束的模型才是好模型。',
          },
        ],
      },
      {
        id: 'ch2-s1',
        title: '2.2 大语言模型（LLM）',
        content: [
          {
            type: 'callout',
            text: '一个类比：如果说传统机器学习模型是一个训练有素、专注于评分规则的信用分析师，那大语言模型（LLM）更像是一位阅读过数十亿份文档的"博学助理"——它能起草报告、解读政策、回答专业问题，但它有时会"一本正经地说错话"，且不擅长精确计算。',
          },
          {
            type: 'p',
            text: '2017 年提出的 Transformer 架构是现代大语言模型的基石。其核心创新使模型能并行处理文本中任意位置的关联，突破了早期模型只能顺序处理的限制。此后，GPT 系列证明了"规模越大能力越强"的路线，ChatGPT（2022 年末）将这项技术带入公众视野，GPT-4（2023 年）进一步提升多模态和推理能力。国内的 DeepSeek、阿里的 Qwen 系列则为金融机构本地部署 LLM 提供了可行方案。',
          },
          {
            type: 'bullets',
            items: [
              {
                term: '上下文学习（In-context Learning）',
                desc: '通过提供几个示例，LLM 无需重新训练即可快速适应新任务，如"分析以下三份合同，标注风险条款"。',
              },
              {
                term: '思维链推理（Chain-of-Thought）',
                desc: '通过让模型逐步推导，显著提升复杂逻辑分析的准确率，类似要求分析师"写出分析过程再给结论"。',
              },
              {
                term: '工具调用（Function Calling）',
                desc: 'LLM 能调用外部 API、数据库、计算引擎，突破纯语言的边界，这是 Agent 能力的基础。',
              },
              {
                term: '核心局限（必须了解）',
                desc: '幻觉（生成不实信息）、知识截止（不知道近期发生的事）、推理成本高、领域知识深度不足。在金融高精度场景，LLM 不适合直接做决策，而应在辅助、总结、规则翻译等任务中发挥价值。',
              },
            ],
          },
          {
            type: 'product-insight',
            text: '当工程师说"我们用 LLM 来解决这个问题"，产品人可以追问三个关键问题：（1）这个任务的核心是语言理解还是精确计算？前者适合 LLM，后者不适合。（2）如果 LLM 输出了错误答案，系统能自动发现并处理吗？（3）这个功能的推理成本是多少，规模化后是否可承受？',
          },
        ],
      },
      {
        id: 'ch2-s2',
        title: '2.3 AI Agent 体系',
        content: [
          {
            type: 'callout',
            text: '一个类比：如果 LLM 是一位博学的顾问，那 Agent（智能体）就是给这位顾问配了一套行动工具——数据库查询权限、模型调用接口、审批流程触发能力。顾问不再只是"给建议"，而是可以"自主去办"。',
          },
          {
            type: 'p',
            text: 'AI Agent 将 LLM 从"对话工具"升级为"自主任务执行者"。其核心思想是让 LLM 扮演"大脑"，通过感知环境、制定计划、调用工具、存储记忆、执行动作的循环，完成复杂的多步任务。在风控场景中，这意味着原本需要风控分析师手动编排的"发现异常→查数据→生成策略→验证效果"全流程，可以由 Agent 自主编排执行。',
          },
          {
            type: 'bullets',
            items: [
              { term: '感知（Perception）', desc: '接收用户意图和系统上下文，理解当前任务目标和约束。' },
              { term: '规划（Planning）', desc: '将复杂目标拆解为可执行的子任务序列，决定调用哪些工具和执行步骤。' },
              { term: '工具（Tools）', desc: '通过 Function Calling 调用外部能力：SQL 查询、模型推理、规则引擎、消息推送等。' },
              { term: '记忆（Memory）', desc: '短期记忆（对话上下文）+ 长期记忆（向量数据库中的历史案例），支撑知识复用。' },
              { term: '执行（Action）', desc: '调度工具完成任务，观察结果，根据反馈调整后续步骤，形成闭环。' },
            ],
          },
          {
            type: 'table',
            headers: ['架构模式', '适用场景', '风险等级'],
            rows: [
              ['单 Agent', '明确、线性的任务（如：生成一份逾期分析报告）', '低'],
              ['多 Agent 协作', '需要多角色协同（如：策略生成→合规核查→效果评估）', '中'],
              ['人机协同', '高风险决策节点（如：授信政策调整需人工确认）', '低（有人把关）'],
            ],
          },
          {
            type: 'product-insight',
            text: 'Agent 是目前 AI 风控领域最热的方向，也是最容易"PPT 好看、落地难"的方向。评估一个 Agent 方案时，重点看三点：（1）失败时是否有安全回退机制？（2）所有操作是否可审计、可追溯？（3）人工介入的节点是否清晰界定？一个好的 Agent 设计，是在每个高风险决策节点都有明确的"人工确认门"。',
          },
        ],
      },
      {
        id: 'ch2-s3',
        title: '2.4 AI 在金融行业的应用全景',
        content: [
          {
            type: 'p',
            text: '全球范围内，AI 在金融行业的应用正从"试点探索"转向"规模化部署"。J.P. Morgan 的 COiN 平台用 NLP 解析法律文件，每年节省数十万人工时；蚂蚁集团的智能风控引擎实现毫秒级实时决策；Capital One 将 ML 深度嵌入信用评估全流程。与此同时，各国监管态度呈现"鼓励创新+严守合规"的双轨特征——中国金融监管总局强调模型风险管理和算法备案，欧盟 AI Act 对金融领域 AI 应用设定分级监管。',
          },
          {
            type: 'bullets',
            items: [
              { term: '可解释性', desc: '监管要求每笔拒贷必须输出清晰的原因码，模型决策路径可回溯、可审计。这是所有 AI 风控系统的硬性约束。' },
              { term: '公平性', desc: '模型不得基于性别、种族、地域等敏感特征产生歧视性决策，需通过公平性测试并留档。' },
              { term: '数据隐私', desc: '征信数据、交易数据的使用必须遵循最小必要原则，联邦学习和隐私计算成为跨机构数据合作的技术出口。' },
              { term: '模型风险管理', desc: 'MRM 框架要求建立模型生命周期文档、定期验证和独立审计机制，这与产品需求文档体系高度类似。' },
            ],
          },
          {
            type: 'product-insight',
            text: '监管合规不是 AI 项目的"可选项"，而是贯穿始终的约束条件。在产品立项阶段，就应将可解释性要求、数据使用合规、模型备案流程纳入项目计划。事后补救的成本远高于事前设计。',
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
        id: 'ch3-s0',
        title: '3.1 传统信用评分模型',
        content: [
          {
            type: 'p',
            text: '在金融风控领域，逻辑回归和 XGBoost 仍是信用评分模型的基石。逻辑回归以其天然的得分映射特性和监管友好性，在申请评分卡（A 卡）和行为评分卡（B 卡）中广泛应用。XGBoost/LightGBM 则凭借自动处理缺失值、内置特征交互和优秀的泛化能力，在反欺诈和违约概率（PD）预测中持续取得优异表现。实际生产中，通常将两者结合：XGBoost 用于特征筛选和高阶交互发现，LR 用于最终评分的校准和输出。',
          },
          {
            type: 'bullets',
            items: [
              {
                term: 'PD 模型（违约概率）',
                desc: '预测借款人在未来一定期限内发生违约的概率。常用 XGBoost+LR 混合架构，核心特征包括多头借贷、逾期历史、收入负债比等。模型输出映射为信用评分（如 300–900 分）。',
              },
              {
                term: 'LGD 模型（违约损失率）',
                desc: '预测违约发生后债权损失的比率。对催收策略制定起关键作用，直接影响拨备计提和资产定价。',
              },
              {
                term: 'EAD 模型（违约风险敞口）',
                desc: '预测违约时已提取额度占授信额度的比例。对于信用卡等循环信贷产品，EAD 建模直接关系资本充足率计算。',
              },
              {
                term: '催收评分卡（C 卡）',
                desc: '根据逾期后的还款行为特征，对逾期客户进行催收优先级分级，驱动差异化的催收策略（短信→AI 外呼→人工电催→委外→法催）。',
              },
            ],
          },
          {
            type: 'product-insight',
            text: '评分卡体系的产品价值在于把风险判断标准化、可解释化。评审相关需求时，应要求团队说明每类评分模型服务哪个业务动作、输出如何影响准入/定价/催收策略，以及拒绝原因是否能被用户和监管理解。',
          },
        ],
      },
      {
        id: 'ch3-s1',
        title: '3.2 深度学习在风控中的应用',
        content: [
          {
            type: 'p',
            text: '深度学习在金融风控中并非万能，但在特定场景下具有传统 ML 不可替代的优势：对时序行为模式的深度挖掘（LSTM/Transformer）和对关系网络的欺诈检测（GNN）。两者的共同前提是数据量充足、特征维度高、且业务容错率允许适当的模型复杂度。',
          },
          {
            type: 'bullets',
            items: [
              {
                term: '时序行为建模（LSTM/Transformer）',
                desc: '通过建模用户历史交易、登录、设备切换等行为的时间序列，捕捉传统聚合特征无法表达的行为演变趋势。例如：用户近 30 天交易频率加速下降可能预示欺诈前兆。',
              },
              {
                term: '图神经网络（GNN）',
                desc: '通过构建用户-设备-IP-手机号的多维度关联图谱，有效识别欺诈团伙的聚集性特征。典型模式：单一设备登录多账户→账户间共享 IP 段→申请时间高度集中，GNN 将这种多跳关联编码为可学习的特征。',
              },
            ],
          },
          {
            type: 'product-insight',
            text: '深度学习适合捕捉复杂行为和关系模式，但不是默认升级路径。产品侧应追问：传统树模型是否已经接近业务上限、额外精度提升能否覆盖解释性下降和推理成本、是否有足够样本支撑模型稳定训练。',
          },
        ],
      },
      {
        id: 'ch3-s2',
        title: '3.3 大模型与风控结合',
        content: [
          {
            type: 'p',
            text: 'LLM 在风控中的价值不在于替代传统的信用评分模型，而在于处理传统模型无法覆盖的"非结构化"和"知识密集型"任务。当前业界探索的主要方向包括：',
          },
          {
            type: 'list',
            items: [
              '规则生成：用自然语言描述风控需求（如"近 3 天申请超过 5 次的用户拦截"），LLM 将需求直接翻译为可执行的规则或 SQL，减少需求传递中的歧义。',
              '报告撰写：根据模型监控数据自动生成周报/月报，总结 KS 变化趋势、特征漂移情况和策略调整建议。',
              '政策 RAG：将内部合规手册、监管政策文档向量化，支持以自然语言查询"某类客群的准入政策是否合规"。',
              '非结构化数据提取：从合同文本、审批备注、客服工单等非结构化数据中提取关键风险信号，补充到模型特征体系中。',
            ],
          },
          {
            type: 'product-insight',
            text: '大模型在风控中的价值，首先出现在"把专家经验自动化"的任务上，而不是"替代专家决策"。最直接的 ROI 往往来自规则翻译（减少产品-工程往返沟通）和报告自动化（解放分析师的重复性劳动）。评估 LLM 项目 ROI 时，优先看这两类场景。',
          },
        ],
      },
      {
        id: 'ch3-s3',
        title: '3.4 Agent 化风控',
        content: [
          {
            type: 'p',
            text: 'Agent 化是风控智能化的下一个演进方向。其本质是将原本由风控分析师手动编排的"发现问题→定位原因→生成策略→验证效果→灰度上线"全流程，转化为 Agent 自主调度的多步推理与执行链。',
          },
          {
            type: 'p',
            text: '在实际架构中，风控 Agent 通常包含：数据查询 Agent（SQL 生成+执行）、模型推理 Agent（调用 PD/反欺诈模型）、策略生成 Agent（规则合成+合规对齐）、效果评估 Agent（回测+收益曲线计算）。多 Agent 通过消息总线协作，状态由持久化 Memory 保存，确保可审计性。',
          },
          {
            type: 'product-insight',
            text: 'Agent 化风控最容易被包装成"全自动闭环"，但产品设计必须先定义哪些动作只能建议、哪些动作允许自动执行、哪些动作必须人工审批。权限边界比智能程度更重要。',
          },
        ],
      },
      {
        id: 'ch3-s4',
        title: '3.5 模型可解释性与合规',
        content: [
          {
            type: 'p',
            text: '在金融监管框架下，模型可解释性不是加分项而是必选项。SHAP（Shapley Additive Explanations）是当前行业标准工具，它基于博弈论将单个预测结果分解为各特征的贡献度。对于单笔拒贷，SHAP 可输出"多头借贷次数贡献+15 分，收入负债比贡献-8 分"等逐特征归因，满足监管对"拒贷理由"的要求。',
          },
          {
            type: 'chart',
            chartId: 'model-interpretability',
          },
          {
            type: 'product-insight',
            text: '可解释性是风控 AI 项目的"监管红线"。在方案评审时，要求工程团队演示拒贷原因码的输出效果：能否用非技术语言向用户解释"为什么被拒"，是判断可解释性是否达标的实用标准。',
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
        id: 'ch4-s0',
        title: '4.1 数据源全景',
        content: [
          {
            type: 'p',
            text: '风控模型的效果上限由数据质量决定。当前金融机构可获取的数据源已形成多层体系：从央行征信的基础信用画像，到设备指纹的行为轨迹，再到三方数据的外部交叉验证。构建统一、实时、可信的数据层是 AI 风控系统的第一道工程门槛。',
          },
          {
            type: 'chart',
            chartId: 'data-source-coverage',
          },
          {
            type: 'product-insight',
            text: '数据采购是 AI 风控项目中最容易被低估的成本。在评估项目可行性时，需要明确：（1）所需数据源是否已接入？（2）数据使用协议是否符合合规要求？（3）数据实时性是否满足业务需求（T+1 还是实时）？这三个问题比模型选型更优先。',
          },
        ],
      },
      {
        id: 'ch4-s1',
        title: '4.2 特征工程方法论',
        content: [
          {
            type: 'p',
            text: '特征工程是风控建模中最耗时但也最关键的环节。数据决定了模型的上限，而特征工程决定了接近这个上限的程度。核心方法论包括：时序窗口聚合（以当前时刻为锚点，向前取 7 天/30 天/90 天/180 天滑动窗口计算各类统计量）、交叉特征（多头借贷次数 × 设备关联账户数）、以及 WOE/IV 编码（将连续变量离散化后映射为与违约概率单调相关的分值）。',
          },
          {
            type: 'bullets',
            items: [
              {
                term: '时序窗口聚合',
                desc: '以事件时间为锚点，对过去 N 天内的行为计数、求和、均值、标准差。典型窗口：7d/14d/30d/90d/180d。需注意信息泄漏——不能使用未来数据聚合历史窗口，这是初级团队最常犯的错误。',
              },
              {
                term: '交叉特征',
                desc: '两两或多维特征的交互组合，如"多头借贷次数 × 收入水平"。树模型本身具备自动交叉能力，但显式构造的交叉特征可降低模型学习难度。',
              },
              {
                term: 'WOE/IV 编码',
                desc: '将原始特征转换为与违约概率单调相关的分值。IV（Information Value）衡量特征的预测能力：IV<0.02 为弱特征，IV>0.3 为强特征，可用于特征筛选优先级排序。',
              },
              {
                term: '分箱策略',
                desc: '等频分箱（每箱样本量相近）适用于分布均匀的特征；卡方分箱通过合并相似区间优化 IV 值，适用于提升模型区分度。',
              },
            ],
          },
          {
            type: 'product-insight',
            text: '特征工程耗时通常占 AI 项目 60–70%。若一个项目承诺"3 个月上线"，需确认是否已有完整的特征基础设施（Feature Store）。没有这个基础，3 个月很可能都花在数据清洗和变量开发上，最终导致项目延期。',
          },
        ],
      },
      {
        id: 'ch4-s2',
        title: '4.3 自动化特征工程（AutoFE）',
        content: [
          {
            type: 'p',
            text: '传统特征工程依赖风控专家的手工经验，周期长、覆盖面有限。AutoFE 系统通过预定义的基础算子（聚合、差分、比率、时序衰减加权等），对原始字段进行自动遍历组合，生成候选高阶特征，再通过特征重要性评估和 IV 筛选进行剪枝，最终输出优化后的特征集。这一流程可将特征加工周期从数天压缩至数小时。',
          },
          {
            type: 'list',
            items: [
              '算子库：count、sum、mean、std、max、min、diff、ratio、ema（指数衰减加权平均）等基础算子',
              '自动组合：原始字段 × 算子 × 时间窗口的三维遍历，生成候选特征池',
              '特征筛选：基于 IV 值、相关性（>0.8 剔除）、缺失率（>80% 剔除）、PSI 稳定性进行多维过滤',
              '增量更新：新特征自动与在线特征库对比，仅保留增量贡献显著的候选',
            ],
          },
          {
            type: 'product-insight',
            text: 'AutoFE 的价值不只是"自动生成更多特征"，而是缩短策略迭代周期。立项时应明确候选特征如何验收、无效特征如何淘汰、自动生成的变量是否能被业务解释，否则容易把特征库变成新的黑箱。',
          },
        ],
      },
      {
        id: 'ch4-s3',
        title: '4.4 特征稳定性监控',
        content: [
          {
            type: 'p',
            text: '模型上线后，特征分布的变化往往先于模型效果的衰退。PSI（Population Stability Index）是最常用的特征漂移检测指标：PSI < 0.1 表示分布稳定，0.1–0.25 需关注，> 0.25 表示显著偏移需排查根因。在实际生产中，通常对 Top N 个重要特征建立 PSI 监控面板，配合 KS 检验进行多维度的分布偏移预警。',
          },
          {
            type: 'product-insight',
            text: '特征稳定性监控应进入产品运营指标，而不只是模型团队的技术面板。产品人至少要知道：哪些核心特征漂移会影响准入策略、告警后谁负责确认、是否需要暂停某类自动决策。',
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
        id: 'ch5-s0',
        title: '5.1 贷前：反欺诈与信用评估',
        content: [
          {
            type: 'p',
            text: '贷前是风控策略最密集的环节，需要在毫秒级完成多维度风险评估。典型的贷前 AI 管线包括：设备指纹校验（识别模拟器、多开、Root 等风险环境）→ 反欺诈模型（多头借贷、黑名单、关联网络）→ 信用评分（PD 模型输出信用分）→ 风险定价（基于风险等级差异化定价）→ 准入决策（给出通过/拒绝/人工审核的最终决策）。AI 在每个节点的价值体现在：策略自动化寻优、模型精度持续提升、以及 AI 辅助的个案分析。',
          },
          {
            type: 'chart',
            chartId: 'loan-stage-impact',
          },
          {
            type: 'product-insight',
            text: '贷前 AI 的核心产品价值不只是降低坏账率，更重要的是提升审批一致性——相同风险特征的申请人应获得相同决策。不一致的决策不仅影响用户体验，也是监管公平性审查的重点。在产品设计时，将"决策一致性"作为与"通过率"和"坏账率"同等重要的 KPI 来追踪。',
          },
        ],
      },
      {
        id: 'ch5-s1',
        title: '5.2 贷中：动态监控与额度管理',
        content: [
          {
            type: 'p',
            text: '贷中风控的核心是动态感知客户的信用变化并提前干预。行为评分卡（B 卡）基于客户用款、还款、消费等贷后行为数据训练，通常以月为周期滚动更新。AI 的价值在于：将行为评分的更新频率从月级提升到日级，通过异常行为检测（如交易频率突增、异地登录频次上升等信号）触发动态额度调整（降额/冻结）或早期预警，在逾期发生前采取主动干预措施。',
          },
          {
            type: 'product-insight',
            text: '贷中动态管理要避免"过度反应"。额度调整、冻结、预警触达都会影响用户体验，产品侧需要设计分层干预策略：轻微信号先提醒或观察，强风险信号再进入降额、冻结或人工复核。',
          },
        ],
      },
      {
        id: 'ch5-s2',
        title: '5.3 贷后：智能催收与资产处置',
        content: [
          {
            type: 'p',
            text: '贷后催收的核心效率指标是在成本约束下最大化回款率。AI 在催收链条中的主要应用包括：催收评分卡（C 卡）对逾期客户进行回款意愿和能力的精细化分级（A/B/C/D 级），驱动差异化的催收策略（短信→AI 外呼→人工电催→委外→法催）。大模型驱动的 AI 外呼，能根据催收对象的语气和还款意愿实时调整话术，相比传统 IVR 在接通率和回款率上有显著提升。',
          },
          {
            type: 'product-insight',
            text: 'AI 外呼是贷后场景 ROI 最明确的 AI 应用之一。在评估 AI 外呼方案时，核心指标是：接通率提升幅度、有效承诺还款率、以及平均处理时长。需注意：AI 外呼话术需经过合规团队审核，避免因话术不当引发投诉或监管风险。',
          },
        ],
      },
      {
        id: 'ch5-s3',
        title: '5.4 贯穿全局：策略寻优与实验体系',
        content: [
          {
            type: 'p',
            text: '风控不是一次性建模，而是持续的优化迭代过程。贯穿贷前/贷中/贷后的横切能力包括策略寻优引擎（基于进化算法在数千种规则组合中搜索最优解）和 A/B 实验体系（将流量切分为对照组和挑战者组，在真实流量中验证新策略）。当挑战者策略胜出，系统自动推全；当核心指标劣化，自动触发熔断回滚。这一闭环使风控策略的迭代频率从季度级缩短至天级。',
          },
          {
            type: 'product-insight',
            text: '风控 A/B 实验不能只看通过率或转化率，必须同时观察坏账、投诉、人工复核量和合规风险。挑战者策略上线前，应先定义胜出条件和熔断条件，避免短期收益掩盖长期风险。',
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
        id: 'ch6-s0',
        title: '6.1 模型生命周期管理',
        content: [
          {
            type: 'p',
            text: '模型从开发到退役的完整生命管理是 MLOps 的核心课题。一个风控模型会经历：数据准备（样本定义、特征拼接、标签选取）→ 特征工程 → 离线训练与验证（KS/AUC 评估）→ 模型审查（合规评审、可解释性检查）→ 线上部署（模型服务化、灰度发布）→ 运行监控（KS 衰减、特征漂移）→ 模型退役（效果降至阈值以下，触发重训或替换）。每个阶段的交付物和审批节点需在系统中有明确的元数据记录，满足 MRM 审计要求。',
          },
          {
            type: 'chart',
            chartId: 'mlops-pipeline',
          },
          {
            type: 'product-insight',
            text: 'MLOps 是 AI 项目"从 demo 到持续生产"最容易被低估的投入。在立项时，要求工程团队回答：模型效果下降到什么程度触发告警？触发后谁负责排查？重训一次需要多长时间？没有答案的项目，上线后大概率会出现"模型悄悄变差但无人知晓"的情况。',
          },
        ],
      },
      {
        id: 'ch6-s1',
        title: '6.2 实时与离线推理架构',
        content: [
          {
            type: 'p',
            text: '风控场景对推理架构的要求是"离线跑得动、在线跑得快"的混合模式。离线层基于批量计算进行特征计算和模型打分，输出客群级别的风险画像，支撑 T+1 的策略分析和报表。在线层则要求毫秒级响应：当用户提交申请时，实时特征服务（Feature Store）在 10ms 内返回快照特征，模型完成推理，规则引擎执行准入判断，整个链路通常要求在 200ms 内完成。',
          },
          {
            type: 'product-insight',
            text: '实时架构的产品评审重点不是技术名词，而是延迟预算和降级方案。需要明确每个环节允许耗时多少、特征服务超时时如何处理、模型不可用时是否回退到规则策略。',
          },
        ],
      },
      {
        id: 'ch6-s2',
        title: '6.3 监控与告警体系',
        content: [
          {
            type: 'p',
            text: '模型监控的核心理念是"在业务感知到问题之前自动发现 ML 指标衰退"。监控体系分为三个维度：模型效果监控（KS、AUC 等区分度指标的周度/月度趋势）、特征稳定性监控（Top N 特征的 PSI 值）、以及预测分布监控（模型输出的分数分布变化、拒绝率变化）。当指标突破阈值，告警自动触发，并根据严重程度执行不同响应：轻度偏离记录日志、中度偏离通知模型 Owner 排查、严重偏离自动触发熔断回滚。',
          },
          {
            type: 'product-insight',
            text: '监控指标必须绑定业务动作。产品人应推动团队把"谁收到告警、多久响应、是否暂停策略、是否通知业务方"写成流程，而不是只建设一个没人看的仪表盘。',
          },
        ],
      },
      {
        id: 'ch6-s3',
        title: '6.4 从监控到重训的自动闭环',
        content: [
          {
            type: 'p',
            text: 'MLOps 的终极目标是将"发现问题→排查根因→数据补充→模型重训→验证上线"这条人工链路转化为自动化回路。当监控系统检测到模型 KS 持续下滑时，自动触发根因分析 Agent；若确认为模型衰退，自动启动重训流水线；新模型完成离线验证后自动注册并提交 A/B 挑战者实验；实验胜出后全量切换。目前行业普遍可实现半自动化（人工确认关键节点），完全自动化仍需在合规审计和变更审批之间寻找平衡。',
          },
          {
            type: 'product-insight',
            text: '自动重训不等于自动上线。金融风控场景下，更合理的目标是"自动发现、自动准备、人工确认、灰度验证"，把自动化用于缩短准备时间，把最终责任保留在清晰的审批链路中。',
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
        id: 'ch7-s0',
        title: '数据隐私与合规技术',
        content: [
          {
            type: 'p',
            text: '数据是风控的燃料，但隐私保护是安全阀。在《个人信息保护法》框架下，跨机构数据协作面临严格合规约束。隐私计算（联邦学习、多方安全计算、可信执行环境）为"数据可用不可见"提供了技术路径：通过联邦学习，多家机构共同训练一个风控模型，各自的数据始终保留在本地，仅传递加密的梯度更新；通过多方安全计算，征信查询和黑名单匹配可在不暴露各方原始数据的前提下完成。',
          },
          {
            type: 'product-insight',
            text: '隐私计算不能替代合规授权。产品方案中仍需明确数据使用目的、授权范围、合作方责任和审计留痕；技术方案只能降低数据暴露风险，不能绕过合规流程。',
          },
        ],
      },
      {
        id: 'ch7-s1',
        title: '模型公平性与算法偏见',
        content: [
          {
            type: 'p',
            text: '公平性在风控中不仅是技术问题，更是监管和社会责任问题。确保模型公平性需要在样本构建（平衡各类群体的训练样本）、特征选择（剔除可能引入偏见的敏感特征）、以及模型后处理（对偏差进行校准）三个环节同时着力。拒绝推断（Reject Inference）是其中的关键难题：我们只能观测被审批通过的客户的还款表现，而被拒绝的客户其真实风险是未知的，这一选择偏差可能导致模型越来越保守。',
          },
          {
            type: 'product-insight',
            text: '公平性不是上线前一次性检查，而应成为长期监控项。产品侧要推动团队定期复盘不同客群的通过率、拒绝原因和申诉情况，避免模型在历史偏差中自我强化。',
          },
        ],
      },
      {
        id: 'ch7-s2',
        title: '从辅助决策到自主决策的信任鸿沟',
        content: [
          {
            type: 'p',
            text: '当前 AI 在风控中的角色定位是"辅助人决策"，但技术演进正在模糊这一边界。当 Agent 能够在数分钟内完成从数据分析到策略生成的完整闭环，并且回测结果优于人工方案时，是否应该允许其自主上线？这不仅是技术信任问题，更涉及责任归属——当 AI 自主决策导致重大损失时，责任由模型开发者、策略 Owner 还是审批流程中的每个节点承担？',
          },
          {
            type: 'chart',
            chartId: 'ai-reliability',
          },
          {
            type: 'product-insight',
            text: '"AI 建议"还是"AI 决策"——这个边界的划定，是产品经理在 AI 风控项目中必须主导的关键决策。建议从低风险场景（营销文案、报告摘要）开始允许 AI 自主，逐步向中等风险延伸（催收策略微调），高风险场景（授信准入阈值变更）长期保留人工确认。在每个阶段建立明确的效果门控，胜出后才允许提升自主化比例。',
          },
        ],
      },
      {
        id: 'ch7-s3',
        title: 'Agent 在金融高风险场景的可靠性边界',
        content: [
          {
            type: 'p',
            text: 'Agent 在金融风控中的最大风险不是能力不足，而是能力边界模糊——LLM 可能在某些推理上表现惊艳，但在简单的数学计算或逻辑一致性上出错。在风控场景中，一个策略调整建议如果包含了未被察觉的幻觉（如引用了不存在的合规条款），可能导致合规事故。因此，Agent 在金融场景中的可靠性工程至关重要：输出需通过规则校验层（格式、数值范围、合规条款引用验证），操作需通过权限控制层（高风险操作必须经过审批），状态需全量记录（满足审计回溯要求）。简而言之，Agent 的"智能"需要用工程的"严谨"来约束。',
          },
          {
            type: 'product-insight',
            text: '判断 Agent 是否可用于高风险场景，关键不在于它能否完成一次漂亮演示，而在于失败时系统是否可控：错误能否被发现、操作能否撤回、责任能否追溯、人工能否及时接管。',
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
            data: [{ x: 85, y: 90, r: 12 }, { x: 78, y: 80, r: 15 }],
            backgroundColor: 'rgba(37, 99, 235, 0.6)',
          },
          {
            label: '集成树模型',
            data: [{ x: 70, y: 75, r: 12 }, { x: 73, y: 70, r: 10 }, { x: 68, y: 78, r: 11 }],
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
          },
          {
            label: '深度学习',
            data: [{ x: 40, y: 60, r: 13 }, { x: 35, y: 55, r: 10 }],
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
          { label: '传统模式 (天)', data: [3, 5, 2, 4, 2, 1], backgroundColor: '#cbd5e1', borderRadius: 3 },
          { label: 'MLOps 自动化 (天)', data: [0.2, 0.3, 0.1, 0.5, 0.1, 0.05], backgroundColor: '#2563eb', borderRadius: 3 },
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

  'loan-stage-impact': {
    render: (canvas) => new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['欺诈识别率 (%)', '审批时效 (分钟)', '风险预警提前 (天)', '催收回款率 (%)'],
        datasets: [
          { label: '传统模式', data: [72, 28, 14, 42], backgroundColor: '#cbd5e1', borderRadius: 4 },
          { label: 'AI 赋能后', data: [94, 3, 45, 61], backgroundColor: '#3b82f6', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          title: {
            display: true,
            text: 'AI 赋能前后关键指标对比（行业参考值）',
            font: { size: 12 },
            color: '#64748b',
            padding: { bottom: 12 },
          },
        },
      },
    }),
  },

  'ai-reliability': {
    render: (canvas) => new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['文本生成与总结', '数据模式识别', '实时高精度决策', '精确数学计算', '合规政策解读', '多步任务编排'],
        datasets: [
          {
            label: '大语言模型 (LLM)',
            data: [92, 65, 40, 35, 72, 78],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.1)',
            pointBackgroundColor: '#f59e0b',
          },
          {
            label: '传统 ML 模型',
            data: [10, 90, 92, 88, 15, 20],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            pointBackgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false, stepSize: 20 },
            grid: { color: '#e2e8f0' },
            pointLabels: { font: { size: 10 } },
          },
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          title: {
            display: true,
            text: 'LLM vs 传统 ML：各类任务的适用性（0–100 分）',
            font: { size: 12 },
            color: '#64748b',
            padding: { bottom: 12 },
          },
        },
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

    case 'product-insight':
      return (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1.5">产品人视角</p>
          <p className="text-sm text-amber-900 leading-relaxed">{block.text}</p>
        </div>
      )

    case 'insight-cards':
      return (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {block.cards.map((card, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="text-xs font-bold text-blue-600 mb-1.5">{card.label}</div>
              <p className="text-sm text-stone-600 leading-relaxed">{card.text}</p>
            </div>
          ))}
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
  const [activeSection, setActiveSection] = useState('ch0-s0')
  const elemRefs = useRef({})
  const chartRefs = useRef([])

  const activeChapter = activeSection ? activeSection.split('-s')[0] : 'ch0'

  // 小节滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    )

    Object.values(elemRefs.current).forEach((el) => {
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
      if (canvas) charts.push(config.render(canvas))
    })
    chartRefs.current = charts

    return () => {
      chartRefs.current.forEach((chart) => chart.destroy())
      chartRefs.current = []
    }
  }, [])

  const scrollTo = useCallback((id) => {
    const el = elemRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* 左侧导航 */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-stone-200 h-screen sticky top-0 overflow-y-auto hidden md:block">
        <div className="px-5 py-6 border-b border-stone-100">
          <h2 className="text-sm font-bold text-stone-900 leading-tight">
            AI 在金融风控领域的应用研究报告
          </h2>
          <p className="text-xs text-stone-400 mt-1">内部技术分享 · 2026</p>
        </div>
        <nav className="py-4">
          {chapters.map((ch) => {
            const chActive = ch.id === activeChapter
            return (
              <div key={ch.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(ch.sections[0]?.id)}
                  className={`block w-full text-left px-5 py-2.5 text-sm transition-colors ${
                    chActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-semibold'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs mr-1.5 opacity-60">{ch.num}</span>
                  {ch.title}
                </button>
                {chActive && ch.sections.length > 1 && (
                  <div className="pb-1">
                    {ch.sections.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => scrollTo(sec.id)}
                        className={`block w-full text-left pl-9 pr-4 py-1.5 text-xs transition-colors truncate ${
                          activeSection === sec.id
                            ? 'text-blue-600 font-medium'
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                      >
                        {sec.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* 移动端顶部导航 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 px-4 py-3">
        <h2 className="text-sm font-bold text-stone-900 truncate">AI 在风控领域应用报告</h2>
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => scrollTo(ch.sections[0]?.id)}
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
              <span>版本 2.0</span>
              <span>·</span>
              <span>内部技术分享</span>
              <span>·</span>
              <span>2026</span>
            </div>
          </header>

          {/* 各章节 */}
          {chapters.map((ch) => (
            <section key={ch.id} className="mb-20">
              <div className="mb-8">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {ch.id === 'ch0' ? '导读' : `第${ch.num}章`}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mt-1">{ch.title}</h2>
                <div className="mt-2 w-12 h-0.5 bg-blue-500"></div>
              </div>

              <div className="space-y-12">
                {ch.sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    ref={(el) => (elemRefs.current[section.id] = el)}
                  >
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
