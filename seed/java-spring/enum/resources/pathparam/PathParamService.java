/**
 * This file was auto-generated by Fern from our API Definition.
 */

package resources.pathparam;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import types.Operand;

@RequestMapping(
    path = "/"
)
public interface PathParamService {
  @PostMapping("/path/{operand}")
  void send(@PathVariable("operand") Operand operand);
}
