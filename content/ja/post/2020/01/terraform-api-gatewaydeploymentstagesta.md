---
title: "Terraform: API Gatewayでdeploymentとstageでstage_nameがconflictする"
originalCreatedAt: 2020-01-12T00:01:00.002+09:00
tags: ["AWS","Terraform"]
---
プライベートでVPSを借りて動かしている古いAPIがある。これをAWSに移行しようと考えており、その過程でTerraformを使ってコード化を進めている。

その中で API Gateway を使っているのだが、`stage`、`deployment` のresourceを普通に定義していったところ、conflictしてしまい正常に実行できなかった。
<!--more-->
GitHub でも issue が見つかり `stage_name` を `”"` とするという解法も見つけた。
[Error creating API Gateway Stage: ConflictException: Stage already exists #2918](https://github.com/terraform-providers/terraform-provider-aws/issues/2918)

以下のような形になる。

```
resource  "aws_api_gateway_stage"  "stage"  {
  depends_on = ["aws_cloudwatch_log_group.log-group-api-gateway-rest-api"]
  stage_name =  "${var.stage-name}"
  rest_api_id =  "${aws_api_gateway_rest_api.api-gateway-rest-api.id}"
  deployment_id =  "${aws_api_gateway_deployment.api-gateway-deployment.id}"
}

resource  "aws_api_gateway_deployment"  "api-gateway-deployment"  {
  depends_on = ["aws_api_gateway_integration.api-gateway-integration"]
  rest_api_id =  "${aws_api_gateway_rest_api.api-gateway-rest-api.id}"
  stage_name =  ""
}
```

一見これで解決するようにも思えたが、API Gateway の設定を変更してデプロイしなければならないときには deploymentを更新する必要があり、そのときには `stage_name` が空では動かない。

対策として、stageの定義自体は実は `deployment` にも情報が含まれているため、stageに含まれていた `depends_on` を `deployment` に移し、`deployment` に統合してstageのresource定義を廃止した。

```
resource "aws_api_gateway_deployment" "api-gateway-deployment" {
  depends_on        = ["aws_cloudwatch_log_group.log-group-api-gateway-rest-api", "aws_api_gateway_integration.api-gateway-integration"]
  rest_api_id       = "${aws_api_gateway_rest_api.api-gateway-rest-api.id}"
  stage_name        = "${var.api-gateway-rest-api-stage-name}"
  stage_description = "${md5(file("../../modules/apigateway.tf"))}"
  lifecycle {
    create_before_destroy = true
  }
}
```

なお、設定変更しても deploy してくれない問題を避けるため、`deployment` の `stage_description` は tf ファイルの内容が変わったら変更が入ったとみなされるようにしている。
