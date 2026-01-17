# PHASE 2: 원인 심층 분석

## 실행 전 필수 지시

> **[중요]** 이 Phase에서는 반드시 다음 절차를 따라야 합니다:
> 1. 모든 가능성을 체계적으로 검토
> 2. 분석 결과를 사용자에게 명확히 제시
> 3. 사용자 확인 후 다음 단계 진행

심층 분석 시 검토해야 할 질문들:
1. 수집된 에러들의 패턴은 무엇인가?
2. 가능한 모든 원인 가설은 무엇인가?
3. 각 가설의 가능성은 어느 정도인가?
4. 코드 추적 결과 실제 원인은 무엇인가?
5. 라이브러리 문서와 가설이 일치하는가?

---

## 분석 프로세스

### STEP 1: 증상 정리

- 수집된 모든 에러 메시지 나열
- 에러 발생 시점과 조건 파악
- 에러 간 연관성 분석

### STEP 2: 가설 수립

- 가능한 원인들을 모두 나열
- 각 가설의 가능성 평가 (높음/중간/낮음)
- 가장 유력한 가설 선정

### STEP 3: 코드 추적

- 에러 스택 트레이스에서 파일 경로, 라인 번호 추출
- 해당 소스 코드를 Read 도구로 확인
- 호출 체인 역추적 (caller → callee)
- 관련 import/export, 의존성 확인

### STEP 3.5: 라이브러리 문서 학습

Context7 MCP를 사용하여 라이브러리 문서 조회:

```
// 1. 라이브러리 ID 확인
mcp__context7__resolve-library-id({
  libraryName: "<라이브러리명>",
  query: "<에러와 관련된 검색 쿼리>"
})

// 2. 관련 문서 학습
mcp__context7__query-docs({
  libraryId: "<확인된 라이브러리 ID>",
  query: "<에러 해결에 필요한 구체적 질문>"
})
```

확인 사항:
- 에러와 관련된 API 사용법, 베스트 프랙티스
- 라이브러리 버전 호환성 및 breaking changes

### STEP 3.7: 가설 교차 검증

STEP 2의 가설과 STEP 3.5에서 학습한 라이브러리 문서 비교:

| 검증 결과 | 가설 상태 | 다음 행동 |
|----------|----------|----------|
| 문서와 일치 | confirmed | 신뢰도 상향, STEP 4 진행 |
| 문서와 불일치 | revised | 가설 수정 후 재검증 |
| 문서에서 명시적 금지 | rejected | 가설 기각, 새 가설 수립 |

추가 확인:
- 문서에서 권장하는 패턴과 현재 코드 패턴 비교
- Deprecated API 사용 여부 확인

### STEP 4: 근본 원인 확정

- 직접 원인 vs 간접 원인 구분
- 수정해야 할 정확한 위치 결정
- 수정 시 영향 범위 평가

### STEP 5: 대안 검토

- 가능한 해결 방법들 나열
- 각 방법의 장단점 비교
- 최적의 수정 방향 선택

---

## 결과물 형식

```yaml
analysis:
  error_type: "<TypeError|NetworkError|...>"
  symptoms:
    - "<증상 1>"
    - "<증상 2>"
  hypotheses:
    - hypothesis: "<가설 1>"
      likelihood: high|medium|low
    - hypothesis: "<가설 2>"
      likelihood: high|medium|low
  root_cause: "<확정된 근본 원인>"
  target_files:
    - path: "<파일>"
      line: <라인>
      reason: "<이 파일을 수정해야 하는 이유>"
  impact_scope: "<수정 시 영향 범위>"
  fix_direction: "<선택된 수정 방향>"
  alternatives_considered:
    - "<검토했지만 선택하지 않은 대안>"
  libraries_referenced:
    - name: "<라이브러리명>"
      version: "<버전>"
      docs_consulted: "<참조한 문서 섹션>"
      key_findings: "<문서에서 발견한 핵심 정보>"
      validation_result: "confirmed|revised|rejected"
```
