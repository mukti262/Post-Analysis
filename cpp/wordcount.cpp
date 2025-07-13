#include <string>
#include <sstream>
#include <emscripten.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int countWords(const char* input) {
        std::string str(input);
        std::istringstream stream(str);
        std::string word;
        int count = 0;

        while (stream >> word) {
            ++count;
        }

        return count;
    }
}