// MAIN BASE FOUNDATION — global language and ecosystem registry.
// This is an extensible local catalog, not a claim that every language/API is exhaustively indexed.
export const LANGUAGE_GROUPS = [
  { label: "Web", items: [
    ["html","HTML","Markup"],["css","CSS","Stylesheets"],["javascript","JavaScript","Programming"],["typescript","TypeScript","Programming"],["jsx","JSX","UI"],["tsx","TSX","UI"],["json","JSON","Data"],["xml","XML","Markup"],["svg","SVG","Graphics"],["graphql","GraphQL","API"]
  ]},
  { label: "Frontend & Backend Frameworks", items: [
    ["react","React / JSX","Framework"],["nextjs","Next.js","Framework"],["vue","Vue","Framework"],["angular","Angular / TypeScript","Framework"],["svelte","Svelte","Framework"],["node","Node.js","Runtime"],["express","Express.js","Framework"],["nestjs","NestJS","Framework"],["php","PHP","Programming"],["laravel","Laravel / PHP","Framework"],["wordpress","WordPress / PHP","CMS"]
  ]},
  { label: "General-purpose languages", items: [
    ["python","Python","Programming"],["java","Java","Programming"],["c","C","Programming"],["cpp","C++","Programming"],["csharp","C#","Programming"],["go","Go","Programming"],["rust","Rust","Programming"],["ruby","Ruby","Programming"],["swift","Swift","Programming"],["kotlin","Kotlin","Programming"],["dart","Dart","Programming"],["scala","Scala","Programming"],["r","R","Statistics"],["julia","Julia","Scientific"],["lua","Lua","Programming"],["perl","Perl","Programming"],["elixir","Elixir","Programming"],["erlang","Erlang","Programming"],["haskell","Haskell","Programming"],["clojure","Clojure","Programming"],["fsharp","F#","Programming"],["ocaml","OCaml","Programming"],["fortran","Fortran","Scientific"],["cobol","COBOL","Enterprise"],["objectivec","Objective-C","Programming"],["assembly","Assembly","Low-level"],["solidity","Solidity","Blockchain"],["sql","SQL","Database"]
  ]},
  { label: "Mobile & Desktop", items: [
    ["flutter","Flutter / Dart","Mobile"],["reactnative","React Native","Mobile"],["android","Android / Kotlin","Mobile"],["ios","iOS / Swift","Mobile"],["electron","Electron / JavaScript","Desktop"],["cypress","Cypress","Testing"],["playwright","Playwright","Testing"]
  ]},
  { label: "Data, AI & APIs", items: [
    ["sql","SQL","Database"],["python","Python / AI-ML","AI & Data"],["graphql","GraphQL","API"],["protobuf","Protocol Buffers","API"],["openapi","OpenAPI / YAML","API"],["jupyter","Jupyter / Python","Notebook"],["pyspark","PySpark","Data"],["pytorch","PyTorch / Python","AI"],["tensorflow","TensorFlow / Python","AI"]
  ]},
  { label: "Systems, DevOps & Cloud", items: [
    ["bash","Bash / Shell","Shell"],["powershell","PowerShell","Shell"],["docker","Dockerfile","Containers"],["yaml","YAML","Configuration"],["toml","TOML","Configuration"],["ini","INI","Configuration"],["terraform","Terraform / HCL","Infrastructure"],["hcl","HCL","Configuration"],["makefile","Makefile","Build"],["cmake","CMake","Build"],["nix","Nix","Configuration"],["nginx","Nginx config","Server"],["githubactions","GitHub Actions / YAML","CI/CD"],["kubernetes","Kubernetes YAML","Orchestration"],["ansible","Ansible / YAML","Automation"]
  ]}
];

export const LANGUAGE_META = Object.fromEntries(
  LANGUAGE_GROUPS.flatMap(group => group.items.map(([id, label, category]) => [id, { id, label, category }]))
);

export const BASE_COMPLETIONS = {
  html: [
    ["doctype","HTML5 document declaration","<!doctype html>"],["html","HTML document root","<html lang=\"en\">"],["head","Document metadata","<head>\\n  <meta charset=\"UTF-8\">\\n  <title>Page title</title>\\n</head>"],["meta","Responsive viewport metadata","<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"],["link","External stylesheet","<link rel=\"stylesheet\" href=\"style.css\">"],["header","Semantic header","<header>\\n  <h1>Page title</h1>\\n</header>"],["main","Main content landmark","<main>\\n  <!-- Main content -->\\n</main>"],["section","Semantic section","<section aria-labelledby=\"section-title\">\\n  <h2 id=\"section-title\">Section</h2>\\n</section>"],["button","Accessible button","<button type=\"button\">Continue</button>"],["form","Form with label","<form>\\n  <label for=\"email\">Email</label>\\n  <input id=\"email\" type=\"email\" required>\\n  <button type=\"submit\">Submit</button>\\n</form>"],["img","Accessible image","<img src=\"image.webp\" alt=\"Describe the image\">"],["script","Load JavaScript","<script src=\"app.js\" defer></script>"] ],
  css: [
    ["display","Layout display mode","display: flex;"],["grid","CSS Grid layout","display: grid;\\ngrid-template-columns: repeat(2, minmax(0, 1fr));\\ngap: 1rem;"],["flex","Flexbox alignment","display: flex;\\nalign-items: center;\\njustify-content: space-between;"],["position","Positioning context","position: relative;"],["width","Responsive width","width: 100%;"],["max-width","Content width limit","max-width: 1200px;\\nmargin-inline: auto;"],["clamp","Fluid responsive size","font-size: clamp(1rem, 2vw, 2rem);"],["media","Responsive media query","@media (max-width: 768px) {\\n  /* Responsive rules */\\n}"],["linear-gradient","Gradient background","background: linear-gradient(135deg, #10213d, #d4af37);"],["box-shadow","Element shadow","box-shadow: 0 8px 24px rgb(0 0 0 / 12%);"],["transition","Smooth transition","transition: color 180ms ease, background 180ms ease;"],["focus-visible","Keyboard focus styling","&:focus-visible { outline: 3px solid #2563eb; outline-offset: 3px; }"] ],
  javascript: [
    ["const","Declare a constant","const value = '';"],["let","Declare a mutable binding","let count = 0;"],["function","Function declaration","function greet(name) {\\n  return `Hello, ${name}!`;\\n}"],["arrow","Arrow function","const greet = (name) => `Hello, ${name}!`;"],["async","Async function","async function loadData() {\\n  const response = await fetch('/api/data');\\n  if (!response.ok) throw new Error('Request failed');\\n  return response.json();\\n}"],["try","Error handling","try {\\n  // Work that may fail\\n} catch (error) {\\n  console.error(error);\\n}"],["map","Transform array items","const result = items.map((item) => item);"],["filter","Filter array items","const result = items.filter((item) => predicate(item));"],["fetch","HTTP request","const response = await fetch('/api/data');\\nconst data = await response.json();"],["addEventListener","Listen for browser events","element.addEventListener('click', (event) => {\\n  // Handle event\\n});"],["localStorage","Browser local storage","localStorage.setItem('key', JSON.stringify(value));"],["import","ES module import","import { name } from './module.js';"] ],
  python: [
    ["def","Define a function","def greet(name: str) -> str:\\n    return f\"Hello, {name}!\""],["class","Define a class","class Example:\\n    def __init__(self, value):\\n        self.value = value"],["async","Async function","async def fetch_data():\\n    result = await get_data()\\n    return result"],["for","Iterate through values","for item in items:\\n    print(item)"],["list","List comprehension","results = [transform(item) for item in items]"],["with","Context manager","with open('file.txt', encoding='utf-8') as file:\\n    content = file.read()"],["try","Exception handling","try:\\n    result = operation()\\nexcept Exception as error:\\n    print(error)"],["import","Import module","import pathlib"],["dataclass","Data class","from dataclasses import dataclass\\n\\n@dataclass\\nclass User:\\n    name: str"],["requests","HTTP request (requests)","response = requests.get(url, timeout=15)\\nresponse.raise_for_status()"] ],
  typescript: [
    ["interface","Object type contract","interface User {\\n  id: string;\\n  name: string;\\n}"],["type","Type alias","type Result<T> = { data: T; error?: string };"],["const","Typed constant","const name: string = 'Rajesh';"],["async","Typed async function","async function loadData(): Promise<unknown> {\\n  const response = await fetch('/api/data');\\n  return response.json();\\n}"],["enum","Enum declaration","enum Status { Ready = 'READY', Failed = 'FAILED' }"],["generic","Generic function","function identity<T>(value: T): T {\\n  return value;\\n}"] ],
  sql: [
    ["select","Query rows","SELECT id, name\\nFROM users\\nWHERE active = TRUE\\nORDER BY name;"],["join","Join related tables","SELECT u.name, o.total\\nFROM users AS u\\nJOIN orders AS o ON o.user_id = u.id;"],["insert","Insert a row","INSERT INTO users (name, email)\\nVALUES ('Example', 'example@example.com');"],["create","Create a table","CREATE TABLE users (\\n  id BIGINT PRIMARY KEY,\\n  name VARCHAR(200) NOT NULL\\n);"],["index","Create an index","CREATE INDEX idx_users_email ON users(email);"],["with","Common table expression","WITH active_users AS (\\n  SELECT * FROM users WHERE active = TRUE\\n)\\nSELECT * FROM active_users;"] ],
  bash: [
    ["shebang","Bash script header","#!/usr/bin/env bash\\nset -euo pipefail"],["for","Loop through items","for item in \"$@\"; do\\n  printf '%s\\n' \"$item\"\\ndone"],["if","Conditional","if [[ -f \"$file\" ]]; then\\n  echo \"File exists\"\\nfi"],["function","Shell function","function greet() {\\n  printf 'Hello, %s\\n' \"$1\"\\n}"],["pipefail","Strict shell mode","set -euo pipefail"] ],
  json: [["object","JSON object","{\\n  \"name\": \"example\",\\n  \"enabled\": true\\n}"],["array","JSON array","[\\n  \"first\",\\n  \"second\"\\n]"]],
  yaml: [["mapping","YAML mapping","name: example\\nenabled: true"],["list","YAML list","items:\\n  - first\\n  - second"],["workflow","GitHub Actions workflow","name: CI\\non: [push, pull_request]\\njobs:\\n  test:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - uses: actions/checkout@v4"]]
};

export const LANGUAGE_KEYWORDS = {
  java: "class public static void main String new return if else for while try catch finally import package interface extends implements final private protected this super throw throws",
  c: "include define int char float double void struct typedef enum return if else for while switch case break continue sizeof malloc free",
  cpp: "include define int char auto const void class public private protected virtual template typename namespace std vector string map unordered_map unique_ptr shared_ptr return if else for while",
  csharp: "using namespace class public private protected static void int string var async await Task interface record get set new return if else foreach",
  go: "package import func type struct interface var const := go defer select chan make append error return if else for range",
  rust: "fn let mut pub mod use struct enum impl trait match self Self Result Option Ok Err async await move where",
  ruby: "def class module require include attr_reader puts do end if elsif else unless each map select begin rescue ensure",
  swift: "import struct class enum let var func guard if else switch case for in async await throws try protocol extension",
  kotlin: "package import class object data val var fun suspend companion when is as if else for in interface override",
  dart: "import class extends mixin final const late var void Future async await Stream Widget build return if else for",
  php: "<?php namespace use class public private protected static function return if else foreach echo require_once",
  r: "library function data.frame tibble mutate filter select ggplot summarise group_by <- if else for return",
  scala: "object class case class def val var trait match case for yield given using enum",
  lua: "local function end if then else elseif for in pairs ipairs return require",
  powershell: "param function Get-ChildItem Get-Content Set-Content Where-Object ForEach-Object if else foreach try catch",
  docker: "FROM WORKDIR COPY ADD RUN CMD ENTRYPOINT EXPOSE ENV ARG USER HEALTHCHECK",
  terraform: "terraform provider resource data variable output locals module required_providers",
  java: "package import public private protected static final class interface enum record void int long double boolean String var new return if else switch case for while do try catch finally throw throws extends implements",
  objectivec: "#import @interface @implementation @property @protocol NSString NSArray NSDictionary NSObject alloc init self nil return if else for while",
  assembly: "section global extern mov lea push pop call ret cmp jmp je jne add sub mul div syscall",
  solidity: "pragma solidity contract interface library function public private external internal view pure payable mapping address uint256 string event emit require revert modifier",
  haskell: "module import data type newtype class instance where let in case of do deriving fmap map foldr",
  elixir: "defmodule defp def fn do end case cond with receive spawn send Enum.Map Enum.filter",
  erlang: "-module -export -behaviour fun case of receive end spawn_link gen_server",
  clojure: "ns def defn let fn if when cond loop recur map filter reduce require",
  fsharp: "module namespace open let mutable type match with function async task member interface",
  ocaml: "let rec type module open fun match with function begin end class object",
  fortran: "program module contains implicit none integer real character logical subroutine function end do if then else use",
  cobol: "IDENTIFICATION DIVISION PROGRAM-ID DATA DIVISION WORKING-STORAGE SECTION PROCEDURE DIVISION DISPLAY ACCEPT MOVE PERFORM",
  perl: "use strict warnings my our sub package print say foreach while if elsif else return shift",
  elixir: "defmodule defp def fn do end case cond with receive spawn send Enum.map Enum.filter",
  scala: "object class case class def val var trait match case for yield given using enum",
  graphql: "query mutation subscription fragment type input enum interface union scalar schema resolver",
  protobuf: "syntax package import message service rpc returns enum repeated optional oneof",
  toml: "title version name description dependencies features",
  ini: "section key value true false",
  makefile: "all build test clean install .PHONY target prerequisites recipe",
  cmake: "cmake_minimum_required project add_executable add_library target_link_libraries find_package",
  nginx: "server listen server_name location proxy_pass root index ssl_certificate",
  nix: "let in with import rec pkgs stdenv buildInputs",
  hcl: "terraform provider resource data variable output locals module required_providers",
  protobuf: "syntax package import message service rpc returns enum repeated optional oneof",
  openapi: "openapi info paths components schemas responses parameters requestBody securitySchemes",
  react: "const function return useState useEffect useMemo useCallback props children export default",
  nextjs: "export default async function generateMetadata metadata params searchParams revalidate dynamic",
  vue: "script setup ref reactive computed onMounted defineProps defineEmits template style",
  angular: "Component Injectable Input Output OnInit signal computed inject standalone",
  svelte: "script let export onMount derived each if await bind class",
  node: "import export require module exports process Buffer fs path http",
  express: "app.get app.post app.put app.delete app.use Router Request Response next",
  nestjs: "Controller Get Post Injectable Module Body Param Query UseGuards",
  laravel: "Route::get Route::post Controller Request Model middleware validate",
  wordpress: "add_action add_filter register_post_type wp_enqueue_script get_header the_content",
  flutter: "import Widget StatelessWidget StatefulWidget BuildContext build setState MaterialApp Scaffold",
  reactnative: "View Text Pressable ScrollView FlatList StyleSheet useState useEffect",
  android: "class fun val var Activity ViewModel Composable remember LaunchedEffect",
  ios: "import SwiftUI View body some Scene App State Binding",
  electron: "app BrowserWindow ipcMain ipcRenderer contextBridge preload",
  cypress: "describe it cy.visit cy.get cy.contains cy.click cy.should",
  playwright: "test expect page.goto page.getByRole locator click fill",
  jupyter: "import pandas as pd import numpy as np display plt.figure",
  pyspark: "SparkSession DataFrame select filter withColumn groupBy agg join",
  pytorch: "import torch nn.Module forward Tensor DataLoader optim Adam",
  tensorflow: "import tensorflow as tf keras Model Dense Sequential compile fit",
  githubactions: "name on push pull_request workflow_dispatch jobs runs-on steps uses run env",
  kubernetes: "apiVersion kind metadata spec replicas selector template containers image ports",
  ansible: "hosts tasks become vars roles name ansible.builtin.copy ansible.builtin.service",
  docker: "FROM WORKDIR COPY ADD RUN CMD ENTRYPOINT EXPOSE ENV ARG USER HEALTHCHECK"
};

export const ECOSYSTEMS = [
  "React","Next.js","Vue","Angular","Svelte","Node.js","Express","NestJS","Django","FastAPI","Flask","Spring Boot","ASP.NET Core","Laravel","Symfony","WordPress","WooCommerce","Ruby on Rails","Phoenix","Flutter","React Native","Android SDK","SwiftUI","Jetpack Compose","Electron","Tauri","PostgreSQL","MySQL","SQLite","MongoDB","Redis","Prisma","Drizzle","GraphQL","REST API","OpenAPI","gRPC","WebSocket","PyTorch","TensorFlow","scikit-learn","Pandas","NumPy","Jupyter","Docker","Kubernetes","Terraform","Ansible","GitHub Actions","GitLab CI","AWS","Azure","Google Cloud","Cloudflare","Nginx","Linux","Bash","PowerShell","Vite","Webpack","Jest","Vitest","Playwright","Cypress","Tailwind CSS","Bootstrap","Sass","WebAssembly","Solidity","Hardhat"
];
