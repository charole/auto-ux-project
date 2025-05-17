<script setup lang="ts">
// 상담 페이지 컴포넌트
</script>

<template>
  <div class="consultation">
    <h1>상담 서비스</h1>

    <div class="consultation-content">
      <div class="description">
        <h2>어떤 도움이 필요하신가요?</h2>
        <p>
          저희 전문 상담사들이 고객님의 문의사항에 친절하게 답변해 드립니다. 아래 폼을 작성하시거나
          직접 연락처로 문의해주세요.
        </p>
      </div>

      <form class="consultation-form">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" placeholder="이름을 입력해주세요" />
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" placeholder="이메일을 입력해주세요" />
        </div>

        <div class="form-group">
          <label for="category">문의 유형</label>
          <select id="category">
            <option value="" disabled selected>문의 유형을 선택해주세요</option>
            <option value="service">서비스 문의</option>
            <option value="technical">기술 지원</option>
            <option value="billing">결제 문의</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div class="form-group">
          <label for="message">문의 내용</label>
          <textarea
            id="message"
            rows="5"
            placeholder="문의하실 내용을 자세히 적어주세요"
          ></textarea>
        </div>

        <button type="submit" class="submit-button">제출하기</button>
      </form>

      <div class="contact-info">
        <h3>직접 연락하기</h3>
        <p><strong>전화:</strong> 02-123-4567</p>
        <p><strong>이메일:</strong> support@example.com</p>
        <p><strong>운영시간:</strong> 평일 9:00 - 18:00 (공휴일 제외)</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consultation {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.consultation h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

.consultation-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.description {
  margin-bottom: 1.5rem;
}

.description h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.description p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.consultation-form {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.contact-info {
  background-color: #f0f7ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.contact-info h3 {
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.contact-info p {
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .consultation-content {
    grid-template-columns: 1fr;
  }
}
</style>
