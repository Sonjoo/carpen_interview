# Carpent Street Dev Task

본 프로젝트는 카펜스트리트 개발자 채용 과제 제출용입니다. 

- Link for task : https://acon3d.notion.site/e9d2aa78264a4c3284163f02b71c4e4c

---
## 개발 환경
> - Language: NestJs with typescript   
> - Database: Mysql 
> - Cache: Redis
> - Running environment: Docker compose      
>    
> ### 개발 환경 설정 배경 
> - 언어 및 framework:   
> 현재 카펜 스트리트에서 사용하고 있는 환경과 가급적이면 유사하게 작성하였습니다.    
> - Database:    
> 가장 익숙하게 사용하는 database 를 사용했습니다.   
> charset 은 utf8_mb4 를 사용합니다. 
> - Cache:   
> 가장 익숙하게 사용하는 redis 를 사용합니다. 
> - Running environment:   
> Docker 기반으로 구성하여 실제로 사용할때 동일하게 진행하실 수 있도록 셋팅했습니다. 
    
---   
## Directory 구조   
> UML: uml 이미지 및 .mdj 파일이 있습니다.    
> Acon: Application code 및 dockerfile 등이 포함되어 있습니다.    
>
   
---

## 작업 방식 
> - use case Diagram 을 통해 use case 정리   
> - Erd 설계 
> - class diagram 작성 및 기본적인 구조 설계   
> - Use case를 기반으로 behavior 도출 
> - Behavior 를 기반으로 Unit test 작성 + 코드 작성 
> - feature 단위의 behavior 를 기반으로 Feature 테스트 작성 및 기능 개발 
> - Docker setting 마무리 
> - Apidocs 를 기반으로 Api 확인이 가능한 view 작성    
> UML에 대한 상세한 내용은 UML 디렉토리의 mdj 형식을 확인 부탁드립니다.(StarUML을 통해 작성했습니다.) 
> --- 

---

## 작업하며 고민했던 것 
> ### 가정
> - 구매자(buyer) 는 가입시 본인의 국가를 설정 할 수 있습니다.   
>  그렇기 때문에 구매자는 본인의 국가를 변경할 수 있습니다. 
> - 환율 기준.   
> 잘 알지 못하는 부분이지만 open api를 사용하였습니다.   
> https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C#tab1   
> 해당 문서의 매매 기준율을 기준으로 환율을 설정했습니다.   
> 매매기준율이 검색시 거래상에 발생하는 환율에 기준이라느 부분을 처음 알았습니다.  
> - 번역 실행 시점   
> 번역본이 만들어지는 시점은 편집자에 검수를 요청하는 시점으로 지정했습니다.   
> 특정 언어에 이상한 점이 있는 경우 직접 변경하는 케이스가 있는 것으로 가정했습니다.   
> - 파파고에서 지원하지 않는 언어에 대한 처리    
> 파파고에서 지원하지 않는 언어의 경우 영문으로 처리하도록 했습니다.   
> 가장 대중적인 언어인만큼 가장 무난하다고 생각하는 방법을 선택했습니다.
> - 공개된 상품의 상세 내용 수정 .    
> 상품의 상세 정보에 대해서 노출중인 상세 정보와 수정하고 있는 상품 상세 정보를 별도로 구분해서 볼 수 있도록 했습니다.   
> 실제 상품인 ProductAssetEntity 의 경우 productId를 통해 접근하고 해당 상품은 상품을 완전 바꾸는 것이기에 공개후에 변경이 불가능하도록 했습니다. 
> ---
> ### 추가
> - 수수료 정책   
> 전달주신 문서상 정찰제를 기준으로 수수료가 확정되는 것을 확인헀습니다.   
> 다만 실제 서비스라는 가정을 두고 개발을 진행하기 위해 수수료율 부과에 대한 option을 둘 수 있도록 개발을 진행했습니다. 
> - 상품의 이미지등 asset 에 대한 부분 
> 기존 문서에는 이미지 및 asset 에 대한 내용이 없어서 별도로 추가했습니다.    
> 에이콘3d 의 특성상 없으면 안된다고 보았습니다.   
> - 구매 
> 구매 과정에 대한 내용을 추가 했습니다. 실제 구매는 아니지만 간단하게 금액에 대한 내용을 추가했습니다.
> 
