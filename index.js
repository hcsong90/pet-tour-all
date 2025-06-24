export default {
  async fetch(request) {
    const url = new URL(request.url);
    const region = url.searchParams.get("region");
    const keyword = url.searchParams.get("keyword");
    const tags = url.searchParams.getAll("tag");

    // 전국 JSON 파일 위치: 직접 업로드한 정적 파일 경로로 교체
    const jsonUrl = "https://hcsong90.github.io/pet-tour-all/pet_tour_all.json"; // 🔧 여기를 실제 URL로 바꾸세요

    try {
      const res = await fetch(jsonUrl);
      const data = await res.json();

      let results = data.items;

      if (region) {
        results = results.filter(item =>
          item.region?.includes(region) || item.addr?.includes(region)
        );
      }

      if (keyword) {
        results = results.filter(item =>
          item.title?.includes(keyword) || item.overview?.includes(keyword)
        );
      }

      if (tags.length > 0) {
        results = results.filter(item =>
          item.tags && tags.some(tag => item.tags.includes(tag))
        );
      }

      return new Response(
        JSON.stringify({
          count: results.length,
          results: results.slice(0, 5) // 최대 5개만 응답
        }),
        {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "데이터를 불러오지 못했습니다", detail: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};
