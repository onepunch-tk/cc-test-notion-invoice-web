/**
 * 이용약관 페이지
 */
export default function TermsPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<div className="container py-12">
					<article className="max-w-3xl space-y-8">
						<div>
							<h1 className="text-3xl font-bold">이용약관</h1>
							<p className="text-sm text-muted-foreground mt-2">
								최종 업데이트: 2026년 1월 15일
							</p>
						</div>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">1. 총칙</h2>
							<p className="text-foreground/90">
								이 약관은 Claude RR7 Starterkit(이하 "회사")이 제공하는 서비스(이하
								"서비스")의 이용에 관한 권리, 의무 및 책임사항, 기타 필요한 사항을 규정합니다.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">2. 용어의 정의</h2>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>
									<strong>회사:</strong> 본 서비스를 제공하는 Claude RR7 Starterkit
								</li>
								<li>
									<strong>사용자:</strong> 본 약관에 따라 회사와 계약을 체결하고 서비스를 이용하는
									개인 또는 법인
								</li>
								<li>
									<strong>계정:</strong> 사용자의 식별 및 서비스 이용을 위해 필요한
									이메일 주소, 패스워드 등의 정보
								</li>
								<li>
									<strong>콘텐츠:</strong> 서비스를 통해 게시되는 모든 형태의 정보 및
									자료
								</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">3. 서비스의 이용</h2>
							<p className="text-foreground/90">
								사용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다. 서비스 이용 시 다음
								사항을 준수해야 합니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>타인의 개인정보를 도용하거나 악용하는 행위</li>
								<li>
									서비스의 정상적인 운영을 방해하거나 손상시키는 행위
								</li>
								<li>
									불법적인 목적으로 서비스를 이용하는 행위
								</li>
								<li>
									타인의 명예를 훼손하거나 권리를 침해하는 행위
								</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">4. 사용자의 권리와 의무</h2>
							<p className="text-foreground/90">
								사용자는 본 약관 및 관련 법령에 따라 다음과 같은 권리를 가집니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>서비스 이용 신청 및 거절할 수 있는 권리</li>
								<li>자신의 개인정보 보호 요청 권리</li>
								<li>
									서비스 이용 중 발생한 피해에 대한 배상 청구 권리
								</li>
								<li>서비스의 중단 및 해지를 요청할 수 있는 권리</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">5. 계정 관리</h2>
							<p className="text-foreground/90">
								사용자는 자신의 계정 정보 보호에 대한 책임을 가집니다. 다음 행위는 금지됩니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>계정 정보의 타인 공유</li>
								<li>부정한 방법으로 계정을 취득 또는 이용하는 행위</li>
								<li>계정의 매매, 양도, 담보 제공 행위</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">6. 서비스의 중단</h2>
							<p className="text-foreground/90">
								회사는 다음의 경우 서비스를 중단할 수 있으며, 이로 인한 손해에 대해 책임을
								지지 않습니다:
							</p>
							<ul className="list-disc list-inside space-y-2 text-foreground/90">
								<li>
									컴퓨터 등 정보통신설비의 보수 등 정기점검으로 인한 경우
								</li>
								<li>
									전기통신사업법에 규정된 기간통신사업자가 전기를 중단한 경우
								</li>
								<li>국가비상사태, 천재지변 또는 이에 준하는 불가항력적 사유</li>
							</ul>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">7. 책임의 제한</h2>
							<p className="text-foreground/90">
								회사는 서비스 이용과 관련하여 사용자가 입은 손해에 대해 책임을 지지 않습니다.
								다만, 회사의 고의 또는 과실로 인한 경우는 제외합니다.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">8. 준거법 및 관할</h2>
							<p className="text-foreground/90">
								본 약관은 대한민국 법률에 따라 규정되며, 본 약관으로 인한 분쟁은 대한민국의
								법원에 제소합니다.
							</p>
						</section>

						<section className="space-y-4">
							<h2 className="text-2xl font-semibold">9. 약관의 변경</h2>
							<p className="text-foreground/90">
								회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에
								공지합니다. 변경 사항에 동의하지 않으면 서비스 이용을 중단할 수 있습니다.
							</p>
						</section>
					</article>
				</div>
			</main>
		</div>
	);
}
