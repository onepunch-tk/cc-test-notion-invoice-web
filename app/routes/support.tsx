/**
 * 고객지원 페이지
 */
export default function SupportPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<div className="container py-12">
					<article className="max-w-3xl space-y-8">
						<div>
							<h1 className="text-3xl font-bold">고객지원</h1>
							<p className="text-sm text-muted-foreground mt-2">
								Claude RR7 Starterkit 고객지원 센터
							</p>
						</div>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">자주 묻는 질문 (FAQ)</h2>
							<div className="space-y-6">
								<div>
									<h3 className="font-semibold text-foreground mb-2">
										Q. 서비스를 이용하려면 어떻게 하나요?
									</h3>
									<p className="text-foreground/90">
										A. 회원가입을 통해 계정을 만든 후, 로그인하여 서비스를 이용할 수
										있습니다. 이메일 주소와 패스워드만으로 간단하게 가입할 수 있습니다.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-foreground mb-2">
										Q. 비밀번호를 잊어버렸어요. 어떻게 해야 하나요?
									</h3>
									<p className="text-foreground/90">
										A. 로그인 페이지에서 "비밀번호를 잊으셨나요?" 링크를 클릭하여 비밀번호
										재설정 메일을 받을 수 있습니다. 이메일을 확인하고 지시에 따라 새로운
										비밀번호를 설정하세요.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-foreground mb-2">
										Q. 계정을 탈퇴하려면 어떻게 하나요?
									</h3>
									<p className="text-foreground/90">
										A. 로그인 후 설정 페이지에서 계정 탈퇴를 요청할 수 있습니다. 계정 탈퇴
										시 모든 데이터가 영구적으로 삭제되므로 신중히 결정하세요.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-foreground mb-2">
										Q. 서비스 이용에 문제가 생겼어요.
									</h3>
									<p className="text-foreground/90">
										A. 문제 발생 시 아래의 연락처로 문의해주세요. 최대한 빠르게 해결해
										드리겠습니다.
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-foreground mb-2">
										Q. 서비스는 항상 이용할 수 있나요?
									</h3>
									<p className="text-foreground/90">
										A. 일반적으로 서비스는 24시간 이용 가능합니다. 다만 정기 점검이나
										장애 상황에서는 일시적으로 서비스가 중단될 수 있습니다.
									</p>
								</div>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">연락처</h2>
							<div className="space-y-3 text-foreground/90">
								<p>
									<strong>이메일:</strong> support@example.com
								</p>
								<p>
									<strong>전화:</strong> 02-1234-5678 (평일 09:00 - 18:00)
								</p>
								<p>
									<strong>주소:</strong> 서울시 강남구 테헤란로 123, 4층
								</p>
								<p>
									<strong>운영 시간:</strong> 월 - 금 09:00 - 18:00 (공휴일 제외)
								</p>
							</div>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">지원 프로세스</h2>
							<ol className="list-decimal list-inside space-y-3 text-foreground/90">
								<li>문제를 상세히 설명하여 이메일 또는 전화로 문의</li>
								<li>고객지원팀에서 24시간 내 접수 확인 메일 발송</li>
								<li>담당자가 문제를 분석하여 해결 방안 제시</li>
								<li>고객 확인 후 문제 해결 완료</li>
							</ol>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">버그 리포트</h2>
							<p className="text-foreground/90">
								서비스 이용 중 버그나 오류를 발견하셨다면 아래 정보를 포함하여 문의해주세요:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>문제가 발생한 페이지 주소</li>
								<li>문제 발생 환경 (브라우저, 운영체제)</li>
								<li>상세한 문제 설명</li>
								<li>스크린샷 (가능한 경우)</li>
								<li>재현 방법</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">기술 지원</h2>
							<p className="text-foreground/90">
								기술 문제로 도움이 필요하신 경우, 다음 정보를 먼저 확인해보세요:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>브라우저 캐시 삭제 및 재로그인</li>
								<li>다른 브라우저에서 접속 시도</li>
								<li>JavaScript가 활성화되어 있는지 확인</li>
								<li>인터넷 연결 상태 확인</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">피드백 및 제안</h2>
							<p className="text-foreground/90">
								서비스 개선을 위한 의견이나 새로운 기능 요청은 언제든지 환영합니다.
								고객님의 소중한 피드백이 더 나은 서비스를 만드는 데 도움이 됩니다.
								위의 연락처를 통해 언제든지 문의해주세요.
							</p>
						</section>
					</article>
				</div>
			</main>
		</div>
	);
}
