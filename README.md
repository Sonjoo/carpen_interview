# Carpent Street Dev Task

본 프로젝트는 카펜스트리트 개발자 채용 과제 제출용입니다. 

- Link for task : https://acon3d.notion.site/e9d2aa78264a4c3284163f02b71c4e4c

---
## 개발 환경
> - Language: NestJs with typescript   
> - Database: Mysql       
>    
> ### 개발 환경 설정 배경 
> - 언어 및 framework:   
> 현재 카펜 스트리트에서 사용하고 있는 환경과 가급적이면 유사하게 작성하였습니다.    
> - Database:    
> 가장 익숙하게 사용하는 database 를 사용했습니다.   
> charset 은 utf8_mb4 를 사용합니다. 
    
---

## 작업 과정 
> - use case Diagram 을 통해 use case 정리   
> - Erd 설계  
> - Behavior 를 기반으로 코드 작성  
> - Apidocs 를 기반으로 Api 확인이 가능한 view 작성    
> --- 
![erd](acon_erd.png)
![usecase](acon_usecase.png)
---

## 작업하며 고민했던 것 
> ### 가정
> - 구매자(buyer) 는 국가가 설정되어 있습니다.   
>  그렇기 때문에 구매자는 본인의 국가를 변경할 수 있습니다. 
> - 환율 기준.   
> 한국을 제외한 국가는 모두 달러 환율을 전달하도록 작성했습니다.
> - 번역 실행 시점   
> 번역본이 만들어지는 시점은 편집자가 상품을 Open 상태로 변경하는 시점에 진행합니다.   
> 특정 언어에 이상한 점이 있는 경우 직접 변경하는 케이스가 있는 것으로 가정했습니다.   
> - 파파고에서 지원하지 않는 언어에 대한 처리    
> 파파고에서 지원하지 않는 언어의 경우 영문으로 처리하도록 했습니다.   
> 가장 대중적인 언어인만큼 가장 무난하다고 생각하는 방법을 선택했습니다.
> - 공개된 상품의 상세 내용 수정 .    
> 상품의 상세 정보에 대해서 노출중인 상세 정보와 수정하고 있는 상품 상세 정보를 별도로 구분해서 볼 수 있도록 했습니다.   
> 실제 상품인 ProductAsset 의 경우 productId를 통해 접근하고 해당 상품은 상품을 완전 바꾸는 것이기에 공개후에 변경이 불가능하도록 했습니다. 
> ---
> ### 추가
> - 상품의 이미지등 asset 에 대한 부분 
> 기존 문서에는 이미지 및 asset 에 대한 내용이 없어서 별도로 추가했습니다.    
> 파일 업로드 구현은 제외하고 파일의 url 을 받는 방식으로 작성했습니다.    

--
## 테스트방법 
> jest test 코드를 짜려고 했지만, 생각보다 nestjs 학습시간이 많이 걸려 테스트는 작성하지 못했습니다. 
> 대신 api 테스트가 가능하도록 swagger api 를 적용 했습니다. 
> - database seed   
> root 의 seed.sql을 먼저 적용합니다.    
> seed.sql 에는 nation 설정 및 기본 환율(달러) 적용, 기본적인 buyer, author, editor를 생성합니다. 
> - 상품 만들기    
> swagger Post /products api 를 사용해서 상품을 생성합니다.   
> 상품명은 unique 값이 아니며 예시를 기반으로 여러 상품을 한번에 만들 수 있습니다.  
> - 상품 검토 요청
> Put /products/{id}/status/examine 을 통해 수정할 수 있습니다.   
> - 상품의 공개 
> Put /products/{id}/status/open 을 통해 변경할 수 있습니다.   
> 변경 시점에 파파고를 통해 번역가능한 모든 상품 상세가 생성됩니다. 
> 