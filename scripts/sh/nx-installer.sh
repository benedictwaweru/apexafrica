#!/usr/bin/env bash

set -euo pipefail

# ─────────────────────────────────────────────────────────────────
# nx-installer.sh
#
# Installs @nx/* plugins pinned to the nx core version already
# present in node_modules. The nx version is the single source
# of truth — no plugin will ever be installed at a different version.
#
# Usage:
#   ./scripts/sh/nx-installer.sh                         # install ACTIVE_PLUGINS
#   ./scripts/sh/nx-installer.sh --group backend,build   # install one or more groups
#   ./scripts/sh/nx-installer.sh --plugin @nx/gradle     # install a single plugin
#   ./scripts/sh/nx-installer.sh --all                   # install every plugin in registry
#   ./scripts/sh/nx-installer.sh --list                  # list all plugins and their groups
#   ./scripts/sh/nx-installer.sh --dry-run               # preview without installing
#   ./scripts/sh/nx-installer.sh --yes                   # skip confirmation prompt
# ─────────────────────────────────────────────────────────────────

# ── Colours ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "${CYAN}[info]${RESET}  $*"; }
success() { echo -e "${GREEN}[ok]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[warn]${RESET}  $*"; }
error()   { echo -e "${RED}[error]${RESET} $*" >&2; }
die()     { error "$*"; exit 1; }

# ─────────────────────────────────────────────────────────────────
# PLUGIN REGISTRY
# ─────────────────────────────────────────────────────────────────
# Format: "group:@nx/package-name:description"
# Groups: core | frontend | backend | build | test | quality | mobile | jvm | meta
#
# To add a plugin later: append a line here. Nothing else changes.
# ─────────────────────────────────────────────────────────────────
declare -a REGISTRY=(
  # ── Core ──────────────────────────────────────────────────────
  "core:@nx/workspace:Core workspace generators and schematics"
  "core:@nx/devkit:Utilities for building custom Nx plugins"
  "core:@nx/js:JS/TS executors - tsc, swc, rollup"
  "core:@nx/node:Node.js app generators and executors"

  # ── Backend ───────────────────────────────────────────────────
  "backend:@nx/nest:NestJS generators and executors"
  "backend:@nx/express:Express generators and executors"

  # ── Frontend ──────────────────────────────────────────────────
  "frontend:@nx/react:React app/lib generators, Vite/Webpack integration"
  "frontend:@nx/angular:Angular app/lib generators, full Angular CLI parity"
  "frontend:@nx/vue:Vue 3 app/lib generators"
  "frontend:@nx/web:Framework-agnostic web app support"
  "frontend:@nx/next:Next.js app generators and executors"
  "frontend:@nx/remix:Remix app generators and executors"
  "frontend:@nx/nuxt:Nuxt 3 app generators and executors"

  # ── Build tools ───────────────────────────────────────────────
  "build:@nx/webpack:Webpack executors and composePlugins helper"
  "build:@nx/vite:Vite build/serve/test executors"
  "build:@nx/rollup:Rollup executor for publishable libraries"
  "build:@nx/esbuild:esbuild executor - fast Node/library builds"
  "build:@nx/rspack:Rspack executor (Rust-based webpack-compatible)"

  # ── Testing ───────────────────────────────────────────────────
  "test:@nx/jest:Jest executor with Nx cache integration"
  "test:@nx/cypress:Cypress e2e generators and executors"
  "test:@nx/playwright:Playwright e2e generators and executors"
  "test:@nx/detox:Detox mobile e2e generators and executors"

  # ── Quality & tooling ─────────────────────────────────────────
  "quality:@nx/eslint:ESLint executor with module-boundary rules"
  "quality:@nx/storybook:Storybook generators and executors"

  # ── Mobile ────────────────────────────────────────────────────
  "mobile:@nx/react-native:React Native app generators and executors"
  "mobile:@nx/expo:Expo app generators and executors"

  # ── JVM / polyglot ────────────────────────────────────────────
  "polyglot:@nx/gradle:Gradle project inference and task execution"
  "polyglot:@nx/dotnet:.NET project inference and task execution"
  "polyglot:@nx/php:PHP/Composer project inference and task execution"

  # ── Meta ──────────────────────────────────────────────────────
  "meta:@nx/plugin:Scaffolding for building your own Nx plugins"
)

# ─────────────────────────────────────────────────────────────────
# ACTIVE PLUGINS
# These are installed when you run the script with no flags.
# Edit this list to reflect your workspace baseline.
# ─────────────────────────────────────────────────────────────────
# ─────────────────────────────────────────────────────────────────
# INSTALLED PLUGIN SCANNER
#
# Discovers every @nx/* package already present in node_modules.
# This is the source of truth for the default (no-flag) run —
# no static list to maintain, no staleness if Nx ships new plugins.
# ─────────────────────────────────────────────────────────────────
scan_installed_nx_plugins() {
  local nx_scope="$WORKSPACE_ROOT/node_modules/@nx"
  if [[ ! -d "$nx_scope" ]]; then
    return
  fi
  for dir in "$nx_scope"/*/; do
    local pkg_json="${dir}package.json"
    [[ -f "$pkg_json" ]] || continue
    local plugin_name="@nx/$(basename "$dir")"
    # verify it has a package.json with a name field — filters out non-plugin dirs
    local confirmed
    confirmed=$(cd "$WORKSPACE_ROOT" && node -e \
      "try{const p=require('${plugin_name}/package.json');console.log(p.name)}catch(e){}" 2>/dev/null) || true
    [[ -n "$confirmed" ]] && echo "$plugin_name"
  done
}

# ─────────────────────────────────────────────────────────────────
# REMOTE FETCH
#
# Queries the npm org endpoint for the @nx scope to get the live
# list of all official plugins. Works without curl — uses Node's
# built-in https module. Returns one package name per line.
# ─────────────────────────────────────────────────────────────────
fetch_remote_nx_plugins() {
  node -e "
    const https = require('https');
    https.get('https://registry.npmjs.org/-/org/nx/package', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          Object.keys(JSON.parse(data))
            .filter(p => p.startsWith('@nx/'))
            .sort()
            .forEach(p => console.log(p));
        } catch(e) { process.exit(1); }
      });
    }).on('error', () => process.exit(1));
  " 2>/dev/null
}

# ─────────────────────────────────────────────────────────────────
# Registry helpers
# ─────────────────────────────────────────────────────────────────
registry_all_plugins() {
  for entry in "${REGISTRY[@]}"; do echo "${entry}" | cut -d: -f2; done
}

registry_plugins_in_group() {
  local group="$1"
  for entry in "${REGISTRY[@]}"; do
    local g p
    g=$(echo "$entry" | cut -d: -f1)
    p=$(echo "$entry" | cut -d: -f2)
    [[ "$g" == "$group" ]] && echo "$p"
  done
}

registry_description() {
  local plugin="$1"
  for entry in "${REGISTRY[@]}"; do
    local p d
    p=$(echo "$entry" | cut -d: -f2)
    d=$(echo "$entry" | cut -d: -f3)
    [[ "$p" == "$plugin" ]] && echo "$d" && return
  done
  echo "(no description)"
}

registry_group_of() {
  local plugin="$1"
  for entry in "${REGISTRY[@]}"; do
    local g p
    g=$(echo "$entry" | cut -d: -f1)
    p=$(echo "$entry" | cut -d: -f2)
    [[ "$p" == "$plugin" ]] && echo "$g" && return
  done
  echo "uncatalogued"
}

registry_all_groups() {
  for entry in "${REGISTRY[@]}"; do echo "$entry" | cut -d: -f1; done | sort -u
}

registry_plugin_exists() {
  local plugin="$1"
  for entry in "${REGISTRY[@]}"; do
    local p; p=$(echo "$entry" | cut -d: -f2)
    [[ "$p" == "$plugin" ]] && return 0
  done
  return 1
}

# ─────────────────────────────────────────────────────────────────
# Workspace root — walk up from the script's location until we
# find a package.json, or bail if we reach the filesystem root.
# Can be overridden by setting WORKSPACE_ROOT before running.
# ─────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

find_workspace_root() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    [[ -f "$dir/package.json" ]] && echo "$dir" && return 0
    dir="$(dirname "$dir")"
  done
  return 1
}

if [[ -n "${WORKSPACE_ROOT:-}" ]]; then
  [[ -f "$WORKSPACE_ROOT/package.json" ]] || \
    die "WORKSPACE_ROOT is set to '$WORKSPACE_ROOT' but no package.json was found there."
else
  WORKSPACE_ROOT=$(find_workspace_root "$SCRIPT_DIR") || \
    die "Could not find a package.json walking up from $SCRIPT_DIR. Set WORKSPACE_ROOT explicitly."
fi

# ─────────────────────────────────────────────────────────────────
# Package manager detection
# ─────────────────────────────────────────────────────────────────
detect_package_manager() {
  if   [[ -f "$WORKSPACE_ROOT/pnpm-lock.yaml"   ]]; then echo "pnpm"
  elif [[ -f "$WORKSPACE_ROOT/yarn.lock"         ]]; then echo "yarn"
  elif [[ -f "$WORKSPACE_ROOT/package-lock.json" ]]; then echo "npm"
  else echo "pnpm"
  fi
}

PKG_MANAGER=$(detect_package_manager)

pkg_add_cmd() {
  case "$PKG_MANAGER" in
    pnpm) echo "pnpm add -D $*" ;;
    yarn) echo "yarn add -D $*" ;;
    npm)  echo "npm install --save-dev $*" ;;
  esac
}

# ─────────────────────────────────────────────────────────────────
# Resolve nx core version
#
# We cd into WORKSPACE_ROOT before calling node so that require()
# resolves via Node's normal node_modules lookup — no absolute
# path is ever constructed, which avoids Unix/Windows path
# mismatch issues when running under Git Bash on Windows.
# ─────────────────────────────────────────────────────────────────
NX_VERSION=$(cd "$WORKSPACE_ROOT" && node -e "console.log(require('nx/package.json').version)" 2>/dev/null) || true

[[ -n "$NX_VERSION" ]] || \
  die "nx not found in node_modules. Install it first: $(pkg_add_cmd nx)"

# ─────────────────────────────────────────────────────────────────
# CLI argument parsing
# ─────────────────────────────────────────────────────────────────
DRY_RUN=false
SKIP_CONFIRM=false
INSTALL_ALL=false
LIST_MODE=false
REMOTE=false
REQUESTED_GROUPS=()
REQUESTED_PLUGIN=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)   DRY_RUN=true ;;
    --yes|-y)    SKIP_CONFIRM=true ;;
    --all)       INSTALL_ALL=true ;;
    --list)      LIST_MODE=true ;;
    --remote)    REMOTE=true ;;
    --group)     shift; IFS=',' read -ra REQUESTED_GROUPS <<< "$1" ;;
    --group=*)   IFS=',' read -ra REQUESTED_GROUPS <<< "${1#--group=}" ;;
    --plugin)    shift; REQUESTED_PLUGIN="$1" ;;
    --plugin=*)  REQUESTED_PLUGIN="${1#--plugin=}" ;;
    --help|-h)
      echo ""
      echo -e "  ${BOLD}nx-installer.sh${RESET}"
      echo ""
      echo "  Installs @nx plugins pinned exactly to your installed nx core version."
      echo ""
      echo "  Usage:"
      echo "    ./scripts/sh/nx-installer.sh                         scan & re-pin all installed @nx plugins"
      echo "    ./scripts/sh/nx-installer.sh --group backend,build   install plugins from named groups"
      echo "    ./scripts/sh/nx-installer.sh --plugin @nx/gradle     install a single plugin"
      echo "    ./scripts/sh/nx-installer.sh --all                   install every plugin in local registry"
      echo "    ./scripts/sh/nx-installer.sh --all --remote          install every plugin found on npm"
      echo "    ./scripts/sh/nx-installer.sh --list                  list catalogued + installed plugins"
      echo "    ./scripts/sh/nx-installer.sh --list --remote         also fetch live plugin list from npm"
      echo "    ./scripts/sh/nx-installer.sh --dry-run               preview command without executing"
      echo "    ./scripts/sh/nx-installer.sh --yes                   skip confirmation prompt"
      echo ""
      echo "  Available groups:"
      for g in $(registry_all_groups); do printf "    %s\n" "$g"; done
      echo ""
      exit 0
      ;;
    *) warn "Unknown argument: $1 (ignored)" ;;
  esac
  shift
done

# ─────────────────────────────────────────────────────────────────
# --list mode
# ─────────────────────────────────────────────────────────────────
if [[ "$LIST_MODE" == true ]]; then
  echo ""
  echo -e "  ${BOLD}Nx Plugin Registry${RESET}  ${DIM}nx core: $NX_VERSION${RESET}"

  # Helper: print one plugin row with install status marker
  print_plugin_row() {
    local p="$1" d="$2"
    local installed_ver marker
    installed_ver=$(cd "$WORKSPACE_ROOT" && node -e       "try{console.log(require('${p}/package.json').version)}catch(e){}" 2>/dev/null) || true
    if [[ -n "$installed_ver" ]]; then
      if [[ "$installed_ver" == "$NX_VERSION" ]]; then
        marker="${GREEN}✔${RESET}"
      else
        marker="${YELLOW}!${RESET}"
      fi
    else
      marker=" "
    fi
    printf "  %b %-38s %b%s%b
" "$marker" "$p" "$DIM" "$d" "$RESET"
  }

  # ── Catalogued plugins (from local REGISTRY) ─────────────────
  echo ""
  current_group=""
  for entry in "${REGISTRY[@]}"; do
    g=$(echo "$entry" | cut -d: -f1)
    p=$(echo "$entry" | cut -d: -f2)
    d=$(echo "$entry" | cut -d: -f3)
    if [[ "$g" != "$current_group" ]]; then
      [[ -n "$current_group" ]] && echo ""
      echo -e "  ${BOLD}${YELLOW}[$g]${RESET}"
      current_group="$g"
    fi
    print_plugin_row "$p" "$d"
  done

  # ── Uncatalogued — installed locally but not in REGISTRY ─────
  declare -a uncatalogued_installed=()
  while IFS= read -r p; do
    registry_plugin_exists "$p" || uncatalogued_installed+=("$p")
  done < <(scan_installed_nx_plugins)

  if [[ ${#uncatalogued_installed[@]} -gt 0 ]]; then
    echo ""
    echo -e "  ${BOLD}${YELLOW}[uncatalogued — installed]${RESET}"
    for p in "${uncatalogued_installed[@]}"; do
      print_plugin_row "$p" "installed but not in local registry"
    done
  fi

  # ── Remote — fetch live @nx/* list from npm ──────────────────
  if [[ "$REMOTE" == true ]]; then
    info "Fetching @nx plugin list from npm..."
    declare -a remote_only=()
    while IFS= read -r p; do
      registry_plugin_exists "$p" && continue
      # skip ones already shown in uncatalogued_installed
      already=false
      for u in "${uncatalogued_installed[@]:-}"; do [[ "$u" == "$p" ]] && already=true && break; done
      [[ "$already" == false ]] && remote_only+=("$p")
    done < <(fetch_remote_nx_plugins)

    if [[ ${#remote_only[@]} -gt 0 ]]; then
      echo ""
      echo -e "  ${BOLD}${YELLOW}[uncatalogued — available on npm]${RESET}"
      for p in "${remote_only[@]}"; do
        print_plugin_row "$p" "available on npm — not in local registry"
      done
    else
      echo ""
      dim "  (no additional plugins found on npm beyond the local registry)"
    fi
  fi

  echo ""
  echo -e "  ${DIM}${GREEN}✔${RESET}${DIM} installed & version correct   ${YELLOW}!${RESET}${DIM} installed but version mismatch   (space) not installed${RESET}"
  [[ "$REMOTE" == false ]] &&     echo -e "  ${DIM}Tip: run with --list --remote to also fetch the live plugin list from npm${RESET}"
  echo ""
  exit 0
fi

# ─────────────────────────────────────────────────────────────────
# Resolve target plugin list
# ─────────────────────────────────────────────────────────────────
declare -a TARGET_PLUGINS=()

if [[ "$INSTALL_ALL" == true ]]; then
  if [[ "$REMOTE" == true ]]; then
    info "Fetching full @nx plugin list from npm..."
    while IFS= read -r p; do TARGET_PLUGINS+=("$p"); done < <(fetch_remote_nx_plugins)
    [[ ${#TARGET_PLUGINS[@]} -eq 0 ]] && die "Could not fetch remote plugin list. Check your network."
  else
    while IFS= read -r p; do TARGET_PLUGINS+=("$p"); done < <(registry_all_plugins)
  fi

elif [[ -n "$REQUESTED_PLUGIN" ]]; then
  # Accept any @nx/* plugin — not just registry entries — so future
  # plugins like @nx/docker work without touching this script.
  if ! registry_plugin_exists "$REQUESTED_PLUGIN"; then
    warn "'$REQUESTED_PLUGIN' is not in the registry — installing anyway."
    warn "If this is a new official plugin, add it to the REGISTRY array for group support."
  fi
  TARGET_PLUGINS=("$REQUESTED_PLUGIN")

elif [[ ${#REQUESTED_GROUPS[@]} -gt 0 ]]; then
  for group in "${REQUESTED_GROUPS[@]}"; do
    group=$(echo "$group" | tr -d ' ')
    found=false
    while IFS= read -r p; do
      TARGET_PLUGINS+=("$p")
      found=true
    done < <(registry_plugins_in_group "$group")
    [[ "$found" == false ]] && \
      warn "Group '$group' not found. Run --list to see valid groups."
  done

else
  # No flags — discover what is already installed and re-pin to current nx version
  info "Scanning node_modules/@nx for installed plugins..."
  while IFS= read -r p; do
    TARGET_PLUGINS+=("$p")
  done < <(scan_installed_nx_plugins)
  if [[ ${#TARGET_PLUGINS[@]} -eq 0 ]]; then
    warn "No @nx/* plugins found in node_modules."
    warn "Use --group <name> or --plugin <name> to install plugins for the first time."
    warn "Run --list to browse the registry."
    exit 0
  fi
  info "Found ${#TARGET_PLUGINS[@]} installed @nx plugins — will re-pin all to nx@${NX_VERSION}."
fi

[[ ${#TARGET_PLUGINS[@]} -gt 0 ]] || die "No plugins resolved. Nothing to install."

# ─────────────────────────────────────────────────────────────────
# Deduplicate preserving order
# ─────────────────────────────────────────────────────────────────
declare -a UNIQUE_PLUGINS=()
declare -A _seen=()
for p in "${TARGET_PLUGINS[@]}"; do
  if [[ -z "${_seen[$p]+_}" ]]; then
    UNIQUE_PLUGINS+=("$p")
    _seen[$p]=1
  fi
done

# ─────────────────────────────────────────────────────────────────
# Preview
# ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Workspace:${RESET}       $WORKSPACE_ROOT"
echo -e "${BOLD}Package manager:${RESET} $PKG_MANAGER"
echo -e "${BOLD}nx core version:${RESET} ${GREEN}$NX_VERSION${RESET} ${DIM}(pinned to this — no mismatches possible)${RESET}"
echo ""
echo -e "${BOLD}Plugins to install (${#UNIQUE_PLUGINS[@]}):${RESET}"

declare -a VERSIONED=()
for p in "${UNIQUE_PLUGINS[@]}"; do
  VERSIONED+=("${p}@${NX_VERSION}")
  desc=$(registry_description "$p")
  group=$(registry_group_of "$p")
  printf "  ${CYAN}+${RESET} %-40s ${DIM}[%s] %s${RESET}\n" \
    "${p}@${NX_VERSION}" "$group" "$desc"
done

echo ""
INSTALL_CMD="$(pkg_add_cmd "${VERSIONED[@]}")"
echo -e "${BOLD}Command:${RESET}"
echo -e "  ${DIM}${INSTALL_CMD}${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────
# Dry run exit
# ─────────────────────────────────────────────────────────────────
if [[ "$DRY_RUN" == true ]]; then
  warn "Dry run — nothing was installed."
  exit 0
fi

# ─────────────────────────────────────────────────────────────────
# Confirm
# ─────────────────────────────────────────────────────────────────
if [[ "$SKIP_CONFIRM" == false ]]; then
  read -r -p "$(echo -e "${YELLOW}Proceed? [y/N]:${RESET} ")" confirm
  case "$confirm" in
    [yY][eE][sS]|[yY]) ;;
    *) warn "Aborted."; exit 0 ;;
  esac
fi

# ─────────────────────────────────────────────────────────────────
# Install
# ─────────────────────────────────────────────────────────────────
info "Installing..."
eval "$INSTALL_CMD"
echo ""

# ─────────────────────────────────────────────────────────────────
# Post-install version audit
# ─────────────────────────────────────────────────────────────────
info "Version audit:"
MISMATCH=0
for p in "${UNIQUE_PLUGINS[@]}"; do
  INSTALLED_VER=$(cd "$WORKSPACE_ROOT" && node -e "console.log(require('${p}/package.json').version)" 2>/dev/null) || true
  if [[ -n "$INSTALLED_VER" ]]; then
    if [[ "$INSTALLED_VER" == "$NX_VERSION" ]]; then
      success "${p}@${INSTALLED_VER}"
    else
      error "${p}@${INSTALLED_VER}  expected ${NX_VERSION}  VERSION MISMATCH"
      MISMATCH=1
    fi
  else
    warn "${p} not found in node_modules after install"
    MISMATCH=1
  fi
done

echo ""
if [[ $MISMATCH -eq 0 ]]; then
  success "All ${#UNIQUE_PLUGINS[@]} plugins installed and verified at nx@${NX_VERSION}."
else
  error "One or more plugins did not install at the expected version. See output above."
  exit 1
fi
