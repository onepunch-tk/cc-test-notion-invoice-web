/**
 * 개인정보처리방침 페이지
 */
export default function PrivacyPolicyPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<div className="container py-12">
					<article className="max-w-3xl space-y-8">
						<div>
							<h1 className="text-3xl font-bold">개인정보처리방침</h1>
							<p className="text-sm text-muted-foreground mt-2">
								최종 업데이트: 2026년 1월 15일
							</p>
						</div>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">1. 개인정보의 수집 및 이용 목적</h2>
							<p className="text-foreground/90">
								Claude RR7 Starterkit(이하 "서비스")는 다음의 목적으로 개인정보를 수집하고
								이용합니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>회원가입 및 서비스 제공</li>
								<li>사용자 인증 및 계정 관리</li>
								<li>서비스 개선 및 통계분석</li>
								<li>고객 문의에 대한 응대 및 처리</li>
								<li>법적 의무 이행</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">2. 수집하는 개인정보의 항목</h2>
							<p className="text-foreground/90">다음과 같은 개인정보를 수집합니다:</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>
									<strong>필수정보:</strong> 이메일 주소, 패스워드(암호화 저장)
								</li>
								<li>
									<strong>선택정보:</strong> 사용자 프로필 정보
								</li>
								<li>
									<strong>자동수집정보:</strong> 접속 로그, IP 주소, 쿠키, 서비스 이용 기록
								</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">3. 개인정보의 보유 및 이용 기간</h2>
							<p className="text-foreground/90">
								개인정보는 수집 및 이용 목적이 달성되거나 회원탈퇴 시까지 보유합니다. 단,
								관계법령에 따라 일정 기간 보관해야 하는 경우 해당 기간 동안 보관합니다.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">4. 개인정보의 제3자 제공</h2>
							<p className="text-foreground/90">
								원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는
								예외입니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>법령에 의한 의무 이행</li>
								<li>사용자의 명시적 동의</li>
								<li>서비스 제공을 위한 필수적인 경우</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">5. 개인정보의 안전성 확보 조치</h2>
							<p className="text-foreground/90">
								서비스는 개인정보 보호를 위해 다음과 같은 기술적, 관리적 조치를
								취합니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>개인정보의 암호화 저장 및 전송</li>
								<li>접근 제어 및 권한 관리</li>
								<li>정기적인 보안 감사</li>
								<li>직원 교육 및 관리</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">6. 사용자의 권리</h2>
							<p className="text-foreground/90">
								사용자는 언제든지 다음의 권리를 행사할 수 있습니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>개인정보 열람권</li>
								<li>개인정보 정정 요청권</li>
								<li>개인정보 삭제 요청권</li>
								<li>개인정보 처리 정지 요청권</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">7. 쿠키의 사용</h2>
							<p className="text-foreground/90">
								서비스는 사용자 경험을 개선하기 위해 쿠키를 사용합니다. 사용자는
								브라우저 설정을 통해 쿠키 사용을 거부할 수 있습니다.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">8. 개인정보처리방침의 변경</h2>
							<p className="text-foreground/90">
								이 개인정보처리방침은 법령 또는 서비스의 변경에 따라 수정될 수 있습니다.
								변경 시 최소 7일 전에 공지합니다.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">9. 연락처</h2>
							<p className="text-foreground/90">
								개인정보와 관련된 문의사항이 있으시면 다음으로 연락주시기 바랍니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>이메일: privacy@example.com</li>
								<li>주소: 서울시 강남구 테헤란로 123</li>
							</ul>
						</section>
					</article>
				</div>
			</main>
		</div>
	);
}
