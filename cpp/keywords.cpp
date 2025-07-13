#include <string>
#include <sstream>
#include <unordered_map>
#include <vector>
#include <algorithm>
#include <emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
const char* extractKeywords(const char* input) {
    static std::string result;
    std::unordered_map<std::string, int> freq;
    std::istringstream stream(input);
    std::string word;

    while (stream >> word) {
        if (word.length() >= 4) {
            freq[word]++;
        }
    }

    std::vector<std::pair<std::string, int>> sorted(freq.begin(), freq.end());

    std::sort(sorted.begin(), sorted.end(), [](auto& a, auto& b) {
        return b.second < a.second;
    });

    result.clear();
    int count = 0;
    for (auto& pair : sorted) {
        result += pair.first + ",";
        if (++count == 5) break;
    }

    if (!result.empty()) result.pop_back();

    return result.c_str();
}
}