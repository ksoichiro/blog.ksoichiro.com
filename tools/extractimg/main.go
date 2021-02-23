package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

const (
	imgDir = "static/img/"
)

var (
	re = regexp.MustCompile(`!\[\]\((http[^\)]*?)\)`)
	rePath = regexp.MustCompile(`^.*post/(.*)\.md`)
)

func main() {
		for _, v := range walk("../../content") {
			extract(v)
		}
}

func walk(dir string) []string {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		log.Fatalf("failed to walk dir: %v", err)
	}
	var paths []string
	for _, file := range files {
		if file.IsDir() {
			paths = append(paths, walk(filepath.Join(dir, file.Name()))...)
			continue
		}
		paths = append(paths, filepath.Join(dir, file.Name()))
	}
	return paths
}

func extract(path string) {
	file, err := os.Open(path)
	if err != nil {
		log.Fatalf("failed to open file: %s", path)
	}
	defer file.Close()

	filename := strings.ReplaceAll(path, "../", "")
	sc := bufio.NewScanner(file)
	count := 1
	for sc.Scan() {
		for _, v := range re.FindAllStringSubmatch(sc.Text(), -1) {
			if len(v) == 1 {
				continue
			}
			imgUrl := string(v[1])
			imgName := rePath.ReplaceAllString(path, "$1")
			imgName = strings.ReplaceAll(imgName, "/", "-")
			imgName = fmt.Sprintf("%s%s_%d.png", imgDir, imgName, count)
			count++
			curl := fmt.Sprintf("curl -s -o %s %s", imgName, imgUrl)
			fmt.Println(
				strings.Join([]string{
					filename,
					imgUrl,
					imgName,
					curl,
				}, "\t"),
			)
		}
	}
	if err := sc.Err(); err != nil {
		log.Fatalf("failed to read file: %v", err)
	}
}
