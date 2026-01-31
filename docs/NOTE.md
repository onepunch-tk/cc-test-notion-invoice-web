# 빈번한 실수와 해결 방법

## Bash 스크립트 보안

### 외부 입력 검증
- **문제**: 외부 JSON 입력에서 추출한 값을 검증 없이 명령어에 사용 (명령어 인젝션 취약점)
- **해결**:
  - session_id: 정규식으로 영숫자/하이픈만 허용 (`[a-zA-Z0-9-]+`)
  - 파일 경로: `realpath`로 실제 경로 확인 후 허용된 디렉토리 내인지 검증

```bash
# session_id 검증 예시
validate_session_id() {
    local id="$1"
    [[ "$id" =~ ^[a-zA-Z0-9-]+$ ]]
}

# 경로 검증 예시
validate_path() {
    local path="$1"
    local allowed_dir="$HOME/.claude"
    local resolved=$(realpath "$path" 2>/dev/null) || return 1
    [[ "$resolved" == "$allowed_dir"/* ]]
}
```

### 로깅 보안
- **문제**: `/tmp`에 민감한 정보 로깅 (모든 사용자 접근 가능)
- **해결**:
  - 조건부 로깅 (`DEBUG=1` 환경 변수)
  - 안전한 경로 사용 (`$SCRIPT_DIR/logs/`)

### curl 타임아웃
- **문제**: 타임아웃 없이 네트워크 요청 시 무한 블로킹 가능
- **해결**: `--connect-timeout 5 --max-time 10` 옵션 추가

### find 명령어 최적화
- **문제**: `-maxdepth` 없이 전체 디렉토리 재귀 탐색 (성능 저하)
- **해결**: `-maxdepth 3` 등으로 탐색 범위 제한

---

## Bash 문자열 치환

### 홈 디렉토리 축약
- **문제**: `${VAR/#$HOME/\~}` - 불필요한 백슬래시
- **해결**: `${VAR/#$HOME/~}` - bash 내장 치환에서 `~`는 이스케이프 불필요
