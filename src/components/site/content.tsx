import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BadgeCheck,
  Database,
  Home,
  BotMessageSquare,
  BarChart3,
  Presentation,
  UserRoundCheck,
  GraduationCap,
  ClipboardList,
  MessageCircle,
  X,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BlogSection } from "@/components/site/BlogSection";
import { NoticeSection } from "@/components/site/NoticeSection";
import { PortfolioSection } from "@/components/site/PortfolioSection";

export const NAV_LINKS = [
  { label: "홈", href: "/" },
  { label: "회사 소개", href: "/about" },
  { label: "데이터 분석 & AI", href: "/engineering" },
  { label: "데이터 교육", href: "/education" },
  { label: "뉴스 및 문의하기", href: "/contact" },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <Link to="/" className="text-lg font-extrabold tracking-normal text-foreground">
          data<span className="text-primary"> smart</span>
        </Link>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-navy">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        src="/images/datasmart-hero.jpg"
        alt="data smart"
        width={1920}
        height={1080}
        className="block h-auto w-full object-cover"
      />
    </section>
  );
}

const TECH_BADGES = [
  "SQL",
  "DB 아키텍처 & 성능 튜닝",
  "RAG AI",
  "Python",
  "빅데이터 분석",
];

export function About() {
  return (
    <>
      <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-normal text-primary">
            About Us
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-normal text-foreground sm:text-4xl">
            교과서를 쓴 전문가가
            <br />
            현장의 문제를 해결합니다
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            데이터스마트는 데이터베이스 전문 서적을 집필한 수석 아키텍트가 이끄는
            데이터 엔지니어링 · AI 솔루션 · 데이터 교육 전문 기업입니다. 깊이 있는
            이론과 풍부한 실무 경험을 바탕으로, 공공기관과 기업의 데이터 과제를
            처음부터 끝까지 책임집니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {TECH_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-primary/25 bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mx-auto mt-16 grid max-w-4xl overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[1fr_1.3fr]"
        >
          <img
            src="/images/ceo.jpg"
            alt="데이터스마트 대표 수석 데이터베이스 아키텍트"
            width={560}
            height={632}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
          <div className="flex flex-col justify-center p-7 sm:p-9">
            <span className="text-sm font-bold text-primary">CEO</span>
            <h2 className="mt-2 text-2xl font-extrabold text-card-foreground">데이터스마트 대표</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">수석 데이터베이스 아키텍트</p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-card-foreground">
              <li className="flex gap-2.5">
                <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
                한빛아카데미 《데이터베이스 개론 및 실습》 저자
              </li>
              <li className="flex gap-2.5">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                빅데이터분석기사 · SQLD 보유
              </li>
              <li className="flex gap-2.5">
                <Database className="mt-0.5 size-4 shrink-0 text-primary" />
                DB 아키텍처 설계 · 성능 튜닝 · RAG AI 구축
              </li>
            </ul>
          </div>
        </motion.div>
      </section>
      <PortfolioSection />
    </>
  );
}

const ENGINEERING_SERVICES = [
  {
    icon: Database,
    title: "DB 구축 & 성능 최적화",
    description:
      "대용량 데이터베이스 설계, 쿼리 튜닝, 인덱스 재설계까지 — 느려진 시스템의 근본 원인을 찾아 해결합니다.",
    tags: ["대용량 DB 설계", "쿼리 튜닝", "인덱스 재설계"],
  },
  {
    icon: BotMessageSquare,
    title: "RAG 기반 AI 시스템 개발",
    description:
      "사내 데이터와 결합한 맞춤형 RAG 아키텍처로, 우리 조직만의 정확하고 신뢰할 수 있는 AI를 구축합니다.",
    tags: ["맞춤 RAG 설계", "사내 데이터 연동", "AI 챗봇"],
  },
  {
    icon: BarChart3,
    title: "데이터 시각화 & 대시보드",
    description:
      "경영진과 공공기관을 위한 맞춤 리포팅과 실시간 모니터링 대시보드로 의사결정 속도를 높입니다.",
    tags: ["실시간 모니터링", "경영 리포팅", "공공 대시보드"],
  },
];

type ServiceDetail = {
  summary: string[];
  points: { title: string; text: string }[];
};

const ENGINEERING_DETAILS: Record<string, ServiceDetail> = {
  "DB 구축 & 성능 최적화": {
    summary: [
      "데이터베이스는 모든 정보 시스템의 심장입니다. 초기 설계가 잘못되면 데이터가 쌓일수록 조회 속도가 급격히 떨어지고, 장애와 유지보수 비용이 눈덩이처럼 불어납니다. DB 구축은 업무 요구사항을 분석해 개념·논리·물리 모델로 옮기는 과정이며, 정규화와 반정규화의 균형, 적절한 데이터 타입과 제약 조건 선택이 시스템의 수명을 좌우합니다.",
      "성능 최적화는 이미 운영 중인 시스템에서 병목을 찾아 제거하는 작업입니다. 실행 계획(Execution Plan)을 분석해 비효율적인 조인과 전체 테이블 스캔을 찾아내고, 인덱스 구조를 재설계하며, 쿼리를 재작성해 응답 시간을 수십 배까지 단축할 수 있습니다. 하드웨어 증설 없이도 체감 성능을 크게 끌어올리는 가장 비용 효율적인 방법입니다.",
    ],
    points: [
      { title: "데이터 모델링", text: "ERD 기반 개념·논리·물리 설계와 정규화·반정규화 전략 수립" },
      { title: "쿼리 튜닝", text: "실행 계획 분석, 조인 방식과 순서 최적화, 서브쿼리 개선" },
      { title: "인덱스 설계", text: "실제 접근 패턴에 맞춘 복합 인덱스 구성과 불필요한 인덱스 정리" },
      { title: "운영 안정화", text: "파티셔닝, 백업·복구 전략, 성능 모니터링 체계 구축" },
    ],
  },
  "RAG 기반 AI 시스템 개발": {
    summary: [
      "RAG(Retrieval-Augmented Generation, 검색 증강 생성)는 대규모 언어 모델(LLM)이 답변을 만들기 전에 조직 내부 문서에서 관련 정보를 먼저 검색해 참고하도록 하는 기술입니다. 범용 AI가 알지 못하는 사내 규정, 매뉴얼, 업무 데이터를 근거로 답하기 때문에 '그럴듯한 거짓말(환각)'을 크게 줄이고 답변의 출처까지 함께 제시할 수 있습니다.",
      "RAG 시스템은 문서를 적절한 단위로 나누고(청킹) 벡터로 변환해 저장한 뒤, 질문과 의미적으로 가까운 내용을 찾아 LLM에 전달하는 구조로 동작합니다. 모델을 새로 학습시키지 않아도 최신 문서를 바로 반영할 수 있어 도입 비용이 낮고, 검색 품질이 곧 답변 품질이므로 데이터 정제와 검색 전략 설계가 성공의 핵심입니다.",
    ],
    points: [
      { title: "데이터 수집·정제", text: "PDF, 문서, DB 등 사내 데이터를 AI가 활용할 수 있는 형태로 가공" },
      { title: "벡터 검색 설계", text: "임베딩 모델 선택, 청킹 전략, 키워드·의미 하이브리드 검색 구성" },
      { title: "답변 품질 관리", text: "프롬프트 설계, 출처 표시, 정확도 평가 체계 마련" },
      { title: "서비스 연동", text: "사내 챗봇·업무 시스템·메신저 연동과 문서별 접근 권한 관리" },
    ],
  },
  "데이터 시각화 & 대시보드": {
    summary: [
      "데이터 시각화는 숫자와 표로 가득한 데이터를 차트와 그래프로 바꿔, 누구나 한눈에 흐름과 이상 징후를 파악할 수 있게 하는 작업입니다. 같은 데이터라도 어떻게 보여주느냐에 따라 의사결정의 속도와 정확도가 크게 달라지며, 잘 만든 시각화는 보고서 수십 장보다 빠르게 핵심을 전달합니다.",
      "대시보드는 핵심 지표(KPI)를 한 화면에 모아 실시간 또는 주기적으로 갱신해 보여주는 도구입니다. 효과적인 대시보드는 보는 사람이 '무엇을 결정해야 하는지'에서 출발해 지표를 고르고, 데이터 파이프라인과 연결해 매번 반복되던 수작업 보고서 작성을 자동화합니다.",
    ],
    points: [
      { title: "KPI 정의", text: "조직 목표에 맞는 핵심 지표 도출과 측정 기준 수립" },
      { title: "데이터 파이프라인", text: "여러 시스템의 데이터를 수집·통합해 자동으로 갱신" },
      { title: "시각화 설계", text: "목적에 맞는 차트 선택과 직관적인 화면 레이아웃 구성" },
      { title: "공공 보고 대응", text: "공공기관 보고 양식과 공개 데이터 연동 대시보드 구축" },
    ],
  },
};

const EDUCATION_SERVICES = [
  {
    icon: Presentation,
    title: "기업 · 공공기관 출강",
    description:
      "조직의 데이터 활용 수준에 맞춘 DB 활용법과 AI 도구 실습 교육을 직접 찾아가 진행합니다.",
    tags: ["맞춤 커리큘럼", "실습 중심", "출강 가능"],
  },
  {
    icon: UserRoundCheck,
    title: "1:1 맞춤 실무 코칭",
    description:
      "프로젝트 기반 파이프라인 멘토링으로, 실제 업무에 바로 적용하는 실력을 만들어 드립니다.",
    tags: ["프로젝트 기반", "파이프라인 멘토링", "실무 적용"],
  },
  {
    icon: GraduationCap,
    title: "자격증 시험 대비",
    description:
      "SQLD · 빅데이터분석기사 단기 합격 로드맵 — 자격증 보유자가 직접 핵심만 짚어드립니다.",
    tags: ["SQLD", "빅데이터분석기사", "단기 합격"],
  },
];

const EDUCATION_DETAILS: Record<string, ServiceDetail> = {
  "기업 · 공공기관 출강": {
    summary: [
      "데이터 활용 역량은 이제 특정 부서가 아닌 조직 전체의 경쟁력입니다. 하지만 일반적인 공개 강좌는 우리 조직의 업무 환경과 데이터 수준을 반영하지 못해, 교육이 끝나도 현업에 적용되지 않는 경우가 많습니다. 출강 교육은 강사가 직접 기관을 찾아가 구성원의 수준과 실제 업무를 바탕으로 맞춤 커리큘럼을 운영하는 방식입니다.",
      "사전 수요 조사로 수강생의 직무와 숙련도를 파악한 뒤, SQL 기초부터 데이터 분석, 생성형 AI 도구 활용까지 필요한 내용을 선별해 구성합니다. 이론 설명은 최소화하고 실제 업무 데이터와 유사한 예제로 실습하기 때문에, 교육 직후부터 보고서 작성이나 데이터 조회 업무에 바로 활용할 수 있습니다.",
    ],
    points: [
      { title: "수요 조사 기반 설계", text: "직무·숙련도 분석을 통한 조직 맞춤형 커리큘럼 구성" },
      { title: "DB · SQL 활용", text: "데이터 조회, 집계, 결합 등 현업에서 바로 쓰는 SQL 실습" },
      { title: "AI 도구 실습", text: "생성형 AI와 RAG 기반 도구를 업무에 적용하는 방법 교육" },
      { title: "유연한 운영", text: "단기 특강부터 수일 과정까지 일정·인원에 맞춘 운영" },
    ],
  },
  "1:1 맞춤 실무 코칭": {
    summary: [
      "1:1 실무 코칭은 정해진 강의 대신 수강생이 실제로 진행 중이거나 계획 중인 프로젝트를 교재로 삼는 교육 방식입니다. 강의실 교육에서 다루기 어려운 개인별 고민, 예를 들어 '우리 회사 데이터로 이 분석을 어떻게 설계해야 하는지' 같은 구체적인 문제를 전문가와 함께 풀어갑니다.",
      "데이터 수집부터 정제, 저장, 분석, 시각화로 이어지는 데이터 파이프라인 전 과정을 단계별로 멘토링합니다. 코드 리뷰와 설계 피드백을 통해 혼자서는 놓치기 쉬운 성능 문제와 구조적 결함을 바로잡아, 코칭이 끝난 뒤에도 스스로 문제를 해결할 수 있는 실력을 갖추도록 돕습니다.",
    ],
    points: [
      { title: "현황 진단", text: "현재 역량과 목표를 파악해 개인별 학습 로드맵 수립" },
      { title: "프로젝트 멘토링", text: "실제 업무 과제를 함께 설계하고 단계별로 구현" },
      { title: "코드 · 쿼리 리뷰", text: "작성한 SQL과 Python 코드의 성능과 구조 피드백" },
      { title: "포트폴리오 완성", text: "코칭 결과물을 이직·승진에 활용할 포트폴리오로 정리" },
    ],
  },
  "자격증 시험 대비": {
    summary: [
      "SQLD(SQL 개발자)는 데이터 모델링의 이해와 SQL 기본·활용 능력을 평가하는 국가공인 자격으로, 데이터를 다루는 직무의 기본 역량을 객관적으로 증명합니다. 빅데이터분석기사는 데이터 수집·전처리부터 통계 분석, 머신러닝 모델링과 결과 해석까지 분석 전 과정을 다루는 국가기술자격으로, 필기와 실기(Python 또는 R 작업형)로 구성됩니다.",
      "두 자격증 모두 출제 범위가 넓어 무작정 공부하면 시간이 오래 걸립니다. 자주 출제되는 핵심 개념과 함정 유형을 중심으로 학습 순서를 잡고, 기출 문제 풀이와 실기 작업형 실습을 반복하면 짧은 기간에도 합격선을 안정적으로 넘길 수 있습니다.",
    ],
    points: [
      { title: "SQLD 대비", text: "데이터 모델링 이론과 SQL 기본·활용 핵심 정리 및 기출 풀이" },
      { title: "빅데이터분석기사 필기", text: "분석 기획, 데이터 탐색, 모델링, 결과 해석 영역별 요점 학습" },
      { title: "실기 작업형 실습", text: "Python 기반 전처리·모델링 문제를 시험 환경과 동일하게 연습" },
      { title: "단기 합격 로드맵", text: "시험일 기준 주차별 학습 계획과 모의고사로 실전 점검" },
    ],
  },
};

function ServiceCard({
  service,
  delay,
  selected = false,
  onSelect,
}: {
  service: (typeof ENGINEERING_SERVICES)[number];
  delay: number;
  selected?: boolean;
  onSelect?: (() => void) | undefined;
}) {
  const className = cn(
    "group rounded-lg border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant",
    selected && "border-primary shadow-elegant",
  );
  if (onSelect) {
    return (
      <motion.button
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay }}
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        className={cn(className, "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
      >
        <ServiceCardBody service={service} />
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {selected ? "설명 닫기" : "자세히 보기"}
          <ChevronDown className={cn("size-4 transition-transform", selected && "rotate-180")} />
        </span>
      </motion.button>
    );
  }
  return (
    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay }} className={className}>
      <ServiceCardBody service={service} />
    </motion.div>
  );
}

function ServiceCardBody({ service }: { service: (typeof ENGINEERING_SERVICES)[number] }) {
  const Icon = service.icon;
  return (
    <>
      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-card-foreground">{service.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

function ServiceDetailPanel({
  service,
  detail,
  onClose,
}: {
  service: (typeof ENGINEERING_SERVICES)[number];
  detail: ServiceDetail;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);
  const Icon = service.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 scroll-mt-32 rounded-lg border border-primary/30 bg-card p-7 shadow-elegant sm:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Icon className="size-5" />
          </div>
          <h2 className="text-xl font-extrabold text-card-foreground sm:text-2xl">{service.title}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="설명 닫기">
          <X className="size-5" />
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        {detail.summary.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
      <h3 className="mt-8 text-base font-bold text-card-foreground">주요 내용</h3>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {detail.points.map((point) => (
          <li key={point.title} className="flex gap-3 rounded-lg bg-secondary/70 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-card-foreground">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Engineering() {
  return <ServicePage title="데이터 분석 & AI 구축" eyebrow="Data & AI Engineering" description="설계부터 구축, 최적화까지 — 데이터 인프라의 모든 단계를 전문가가 직접 책임집니다." services={ENGINEERING_SERVICES} details={ENGINEERING_DETAILS} />;
}

export function Education() {
  return <ServicePage title="데이터 교육" eyebrow="Data Education" description="교과서 저자가 직접 가르치는 살아있는 교육 — 조직과 개인의 데이터 역량을 한 단계 끌어올립니다." services={EDUCATION_SERVICES} details={EDUCATION_DETAILS} />;
}

function ServicePage({ title, eyebrow, description, services, details }: { title: string; eyebrow: string; description: string; services: typeof ENGINEERING_SERVICES; details?: Record<string, ServiceDetail> }) {
  const [selected, setSelected] = useState<string | null>(null);
  const activeService = services.find((service) => service.title === selected);
  const activeDetail = selected ? details?.[selected] : undefined;
  return <section className="min-h-[65vh] bg-secondary/50">
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <motion.div {...fadeUp}>
        <span className="text-sm font-bold text-primary">{eyebrow}</span>
        <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
        {details && <p className="mt-3 text-sm text-muted-foreground">카드를 클릭하면 각 분야에 대한 자세한 설명을 볼 수 있습니다.</p>}
      </motion.div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{services.map((service, i) => <ServiceCard key={service.title} service={service} delay={i * 0.1} selected={selected === service.title} onSelect={details?.[service.title] ? () => setSelected(selected === service.title ? null : service.title) : undefined} />)}</div>
      <AnimatePresence mode="wait">
        {activeService && activeDetail && <ServiceDetailPanel key={activeService.title} service={activeService} detail={activeDetail} onClose={() => setSelected(null)} />}
      </AnimatePresence>
      <Button asChild className="mt-10"><Link to="/contact"><MessageCircle />프로젝트/교육 문의하기</Link></Button>
    </div>
  </section>;
}

export function Contact() {
  return (
    <>
      <BlogSection />
      <NoticeSection />
      <section id="contact" className="bg-hero scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-normal text-cyan-soft">
              Contact
            </span>
            <h1 className="mt-1.5 text-xl font-extrabold tracking-normal text-navy-foreground sm:text-2xl">
              문의하기
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-navy-foreground/70">
              맞춤상담 또는 오픈채팅으로 편하게 연락해 주세요.
            </p>
          </motion.div>
          <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
            <motion.div {...fadeUp}>
              <Link
                to="/contact/consult"
                className="group flex h-full flex-col rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-3 text-center backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/60"
              >
                <ClipboardList className="mx-auto size-5 text-cyan-soft" />
                <h3 className="mt-1.5 text-base font-bold text-navy-foreground">맞춤상담</h3>
                <p className="mt-0.5 text-xs font-medium text-cyan-soft">구글폼 1:1 상담 신청</p>
                <p className="mt-1 text-xs text-navy-foreground/60">
                  프로젝트 개요를 남겨주시면 맞춤 제안을 드립니다
                </p>
                <span className="mt-2.5 inline-flex items-center justify-center gap-1 self-center rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground transition-transform group-hover:scale-105">
                  상담 신청하기
                </span>
              </Link>
            </motion.div>
            <motion.a
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.12 }}
              href="https://open.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 px-4 py-3 text-center backdrop-blur transition-all hover:-translate-y-0.5 hover:border-kakao/60"
            >
              <MessageCircle className="mx-auto size-5 text-kakao" />
              <h3 className="mt-1.5 text-base font-bold text-navy-foreground">오픈채팅</h3>
              <p className="mt-0.5 text-xs font-medium text-kakao">카카오톡 1:1 오픈채팅</p>
              <p className="mt-1 text-xs text-navy-foreground/60">
                가볍게 궁금한 점부터 바로 물어보세요
              </p>
              <span className="mt-2.5 inline-flex items-center justify-center gap-1 self-center rounded-full bg-kakao px-3.5 py-1.5 text-xs font-bold text-kakao-foreground transition-transform group-hover:scale-105">
                오픈채팅 열기
              </span>
            </motion.a>
          </div>
        </div>
      </section>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-navy-foreground/10 bg-navy">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <span className="text-lg font-extrabold tracking-normal text-navy-foreground">
              data<span className="text-cyan-soft"> smart</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-navy-foreground/60">
              상호명: 데이터스마트 | 대표자: 수석 아키텍트
              <br />
              설립: 2026년 10월
            </p>
          </div>
          <nav className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-navy-foreground/60 transition-colors hover:text-navy-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 border-t border-navy-foreground/10 pt-6 text-center text-xs text-navy-foreground/40">
          © 2026 data smart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


const HUB_TABS = [
  { to: "/", label: "홈", icon: Home },
  { to: "/about", label: "회사 소개", icon: BookOpen },
  { to: "/engineering", label: "데이터 분석 & AI", icon: Database },
  { to: "/education", label: "데이터 교육", icon: GraduationCap },
  { to: "/contact", label: "뉴스 및 문의하기", icon: MessageCircle },
] as const;

export function HubTabs() {
  return (
    <nav
      aria-label="페이지 바로가기"
      className="sticky top-16 z-30 border-b border-border/70 bg-background"
    >
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
        {HUB_TABS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="shrink-0">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{
                className: "border-primary bg-primary/5 text-primary",
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-4 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent md:hidden"
      />
    </nav>
  );
}

export function Hub() {
  return <Hero />;
}
